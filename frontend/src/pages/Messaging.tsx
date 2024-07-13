import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Grid,
  Typography,
  List,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemAvatar,
  Avatar,
} from '@mui/material'
import MessageSidebar from './Components/MessageSidebar'
import MessageBubble from './Components/MessageBubble'
import SendIcon from '@mui/icons-material/Send'
import { MessageThread, Message, User } from '../interfaces'
import { APIGet, APIPost } from '../APIlink'

const Messaging: React.FC = () => {
  const [selectedListingId, setSelectedListingId] = useState<string>('')
  const [messageInput, setMessageInput] = useState<string>('')
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [open, setOpen] = useState<boolean>(false)
  const [newParticipant, setNewParticipant] = useState<string>('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [userId, setUserId] = useState<string | null>(null)

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
    if (selectedListingId) {
      scrollToBottom()
    }
  }, [selectedListingId, messages[selectedListingId]])

  const fetchMessageThreads = async () => {
    try {
      const fetchedThreads = await APIGet<MessageThread[]>(
        '/api/messages/overview'
      )
      setThreads(fetchedThreads)
      if (fetchedThreads.length > 0) {
        setSelectedListingId(fetchedThreads[0].listing_id)
        fetchMessagesForThread(fetchedThreads[0].listing_id)
      }
    } catch (error) {
      console.error('Failed to fetch message threads:', error)
    }
  }

  const fetchMessagesForThread = async (listing_id: string) => {
    if (!userId) return
    try {
      const fetchedMessages = await APIGet<Message[]>(
        `/api/messages/thread/${listing_id}/${userId}`
      )
      setMessages((prevMessages) => ({
        ...prevMessages,
        [listing_id]: fetchedMessages,
      }))
    } catch (error) {
      console.error(`Failed to fetch messages for thread ${listing_id}:`, error)
    }
  }

  const handleNewConversation = () => {
    setOpen(true)
  }

  const handleCreateNewConversation = async () => {
    if (!newParticipant || !userId) return

    try {
      const user = await APIGet<User>(`/api/user/${newParticipant}`)
      if (!user) {
        alert('User not found')
        return
      }

      const initialMessage: Message = {
        sender_id: userId,
        receiver_id: user.userID,
        listing_id: `listing-${threads.length + 1}`,
        content: `Start of conversation with ${user.name}`,
        sent_at: Date.now(),
      }

      await APIPost<Message, Message>('/messages/', initialMessage)

      const newThread: MessageThread = {
        listing_id: initialMessage.listing_id,
        other_participant: {
          user_id: user.userID,
          name: user.name,
          profilePicture: user.profileUrl,
        },
        last_message: initialMessage,
      }

      setThreads([newThread, ...threads])
      setSelectedListingId(newThread.listing_id)
      setOpen(false)
      setNewParticipant('')

      setMessages((prevMessages) => ({
        ...prevMessages,
        [newThread.listing_id]: [initialMessage],
      }))
      scrollToBottom()
    } catch (error) {
      console.error('Failed to create new conversation:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput || !selectedListingId || !userId) {
      return
    }
    const newMessage: Message = {
      sender_id: userId,
      receiver_id: selectedListingId.split('-')[1],
      listing_id: selectedListingId,
      content: messageInput,
      sent_at: Date.now(),
    }
    try {
      await APIPost<Message, Message>(
        `/api/messages/thread/${selectedListingId}/${userId}`,
        newMessage
      )
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedListingId]: [
          ...(prevMessages[selectedListingId] || []),
          newMessage,
        ],
      }))
      const updatedThreads = threads.map((thread) =>
        thread.listing_id === selectedListingId
          ? { ...thread, last_message: newMessage }
          : thread
      )
      setThreads(updatedThreads)
      setMessageInput('')
      sortThreads()
      scrollToBottom()
    } catch (error) {
      console.error('Failed to send message:', error)
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
    setSelectedListingId(listing_id)
    if (!messages[listing_id]) {
      fetchMessagesForThread(listing_id)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const selectedConversation = threads.find(
    (thread) => thread.listing_id === selectedListingId
  )

  const sortThreads = () => {
    setThreads((prevThreads) =>
      [...prevThreads].sort(
        (a, b) => b.last_message.sent_at - a.last_message.sent_at
      )
    )
  }

  return (
    <Box sx={{ flexGrow: 1, maxHeight: '90vh' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={3} sx={{ height: '100%', maxHeight: '100vh' }}>
          <MessageSidebar
            selectedListingId={selectedListingId}
            onCreateMessage={handleNewConversation}
            messages={threads}
            onSelectMessage={handleSelectMessage}
          />
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%' }}>
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
                  src={selectedConversation?.other_participant.profilePicture}
                />
              </ListItemAvatar>
              <Typography variant="h6">
                {selectedConversation?.other_participant.name}
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
          </Box>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the participant to start a new conversation.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Participant Name"
            fullWidth
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateNewConversation}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Messaging
