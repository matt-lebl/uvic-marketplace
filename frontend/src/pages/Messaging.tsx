import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Grid,
  Typography,
  List,
  TextField,
  IconButton,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from '@mui/material'
import MessageSidebar from './Components/MessageSidebar'
import MessageBubble from './Components/MessageBubble'
import SendIcon from '@mui/icons-material/Send'
import { MessageThread, Message, NewMessage } from '../interfaces'
import { APIGet, APIPost } from '../APIlink'
import { useNavigate } from 'react-router-dom'

const Messaging: React.FC = () => {
  const navigate = useNavigate()

  const [selectedListingId, setSelectedListingId] = useState<string>('')
  const [receiverId, setReceiverId] = useState<string>('')
  const [messageInput, setMessageInput] = useState<string>('')
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userID')
    setUserId(userIdFromStorage)
  }, [])

  useEffect(() => {
    if (userId) {
      fetchMessageThreads()
    }
  }, [userId])

  useEffect(() => {
    if (selectedListingId && receiverId) {
      scrollToBottom()
    }
  }, [selectedListingId, receiverId, messages[selectedListingId]])

  const fetchMessageThreads = async () => {
    setLoading(true)
    try {
      const fetchedThreads = await APIGet<MessageThread[]>(
        '/api/messages/overview'
      )
      if (Array.isArray(fetchedThreads)) {
        const uniqueThreads = Array.from(
          new Set(fetchedThreads.map((thread) => thread.listing_id))
        )
          .map((id) =>
            fetchedThreads.find((thread) => thread.listing_id === id)
          )
          .filter((thread) => thread !== undefined) as MessageThread[]

        uniqueThreads.sort(
          (a, b) => b.last_message.sent_at - a.last_message.sent_at
        )

        setThreads(uniqueThreads)
        if (uniqueThreads.length > 0) {
          setSelectedListingId(uniqueThreads[0].listing_id)
          setReceiverId(uniqueThreads[0].other_participant.user_id)
          await fetchMessagesForThread(
            uniqueThreads[0].listing_id,
            uniqueThreads[0].other_participant.user_id
          )
        }
      } else {
        console.error('Fetched threads is not an array')
        navigate('/error')
      }
    } catch (error) {
      console.error('Failed to fetch message threads', error)
      navigate('/error')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessagesForThread = async (
    listing_id: string,
    receiver_id: string
  ) => {
    if (!userId) return
    try {
      const fetchedMessages = await APIGet<Message[]>(
        '/api/messages/thread/' + listing_id + '/' + receiver_id
      )

      setMessages((prevMessages) => ({
        ...prevMessages,
        [listing_id]: fetchedMessages,
      }))
    } catch (error) {
      console.error('Failed to fetch messages for thread ' + listing_id, error)
      navigate('/error')
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput || !selectedListingId || !userId) {
      return
    }
    const newMessage: NewMessage = {
      receiver_id: receiverId,
      listing_id: selectedListingId,
      content: messageInput,
    }

    try {
      const responseMessage = await APIPost<Message, NewMessage>(
        '/api/messages',
        newMessage
      )
      if (responseMessage) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedListingId]: [
            ...(prevMessages[selectedListingId] || []),
            responseMessage,
          ],
        }))
        const updatedThreads = threads.map((thread) =>
          thread.listing_id === selectedListingId
            ? { ...thread, last_message: responseMessage }
            : thread
        )
        setThreads(updatedThreads)
        setMessageInput('')
        sortThreads()
        scrollToBottom()
      }
    } catch (error) {
      console.error('Failed to send message', error)
      navigate('/error')
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight
      }
    }, 0)
  }

  const handleSelectMessage = (listing_id: string) => {
    const thread = threads.find((thread) => thread.listing_id === listing_id)
    if (thread) {
      setSelectedListingId(listing_id)
      setReceiverId(thread.other_participant.user_id)
      if (!messages[listing_id]) {
        fetchMessagesForThread(listing_id, thread.other_participant.user_id)
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const selectedConversation = Array.isArray(threads)
    ? threads.find((thread) => thread.listing_id === selectedListingId)
    : null

  const sortThreads = () => {
    setThreads((prevThreads) =>
      [...prevThreads].sort(
        (a, b) => b.last_message.sent_at - a.last_message.sent_at
      )
    )
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, maxHeight: '90vh' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={3} sx={{ height: '100%', maxHeight: '100vh' }}>
          <MessageSidebar
            selectedListingId={selectedListingId}
            messages={threads}
            onSelectMessage={handleSelectMessage}
          />
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%' }}>
            {threads.length > 0 ? (
              <>
                <Box
                  sx={{
                    maxHeight: '100vh',
                    display: 'flex',
                    flexGrow: 0,
                    alignItems: 'center',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '24px',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        selectedConversation?.other_participant?.profilePicture
                      }
                    />
                  </ListItemAvatar>
                  <Typography variant="h6">
                    {selectedConversation?.other_participant?.name ||
                      'No conversation selected'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 2,
                    maxHeight: '70vh',
                  }}
                  ref={messagesContainerRef}
                >
                  <List>
                    {messages[selectedListingId] &&
                      messages[selectedListingId].map((message, index) => (
                        <MessageBubble
                          key={index}
                          content={message.content}
                          isSender={message.sender_id === userId}
                        />
                      ))}
                  </List>
                </Box>
                {selectedConversation && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 2,
                      borderTop: '1px solid #f0f0f0',
                      flexShrink: 0,
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Write a message"
                      value={messageInput}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <IconButton
                      aria-label="send message"
                      color="primary"
                      onClick={handleSendMessage}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">No conversations yet.</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Messaging
