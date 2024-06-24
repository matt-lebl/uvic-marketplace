import React, { useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  List,
  TextField,
  IconButton,
} from '@mui/material'
import MessageSidebar from './Components/MessageSidebar'
import MessageBubble from './Components/MessageBubble'
import SendIcon from '@mui/icons-material/Send'
import { MessageThread, Message } from '../interfaces'

const generateMessageThreads = (count: number): MessageThread[] => {
  const threads: MessageThread[] = []

  for (let i = 1; i <= count; i++) {
    threads.push({
      listing_id: `listing-${i}`,
      other_participant: {
        user_id: `user-${i}`,
        name: `User ${i}`,
        profilePicture: `https://example.com/profile-${i}.jpg`,
      },
      last_message: {
        sender_id: `user-${i}`,
        receiver_id: 'user-1',
        listing_id: `listing-${i}`,
        content: `This is the last message for listing ${i}`,
        sent_at: Date.now(),
      },
    })
  }

  return threads
}

const generateMessagesForThread = (
  threadId: string,
  count: number
): Message[] => {
  const messages: Message[] = []

  for (let i = 1; i <= count; i++) {
    messages.push({
      sender_id: i % 2 === 0 ? 'user-1' : threadId.split('-')[1],
      receiver_id: i % 2 === 0 ? threadId.split('-')[1] : 'user-1',
      listing_id: threadId,
      content: `Message ${i} for ${threadId}`,
      sent_at: Date.now() - (count - i) * 60000,
    })
  }

  return messages
}

const messageThreads: MessageThread[] = generateMessageThreads(25)
const messages: Record<string, Message[]> = {}

messageThreads.forEach((thread) => {
  messages[thread.listing_id] = generateMessagesForThread(thread.listing_id, 10)
})

const Messaging: React.FC = () => {
  const [selectedListingId, setSelectedListingId] = useState<string>(
    messageThreads[0].listing_id
  )
  const [messageInput, setMessageInput] = useState<string>('')

  const handleNewConversation = () => {
    console.log('Creating new conversation')
  }

  const handleSendMessage = () => {
    console.log('Sending message:', messageInput)
    setMessageInput('')
  }

  const handleSelectMessage = (listing_id: string) => {
    setSelectedListingId(listing_id)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const selectedConversation = messageThreads.find(
    (thread) => thread.listing_id === selectedListingId
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3} sx={{ height: '100%' }}>
          <MessageSidebar
            selectedListingId={selectedListingId}
            onCreateMessage={handleNewConversation}
            messages={messageThreads}
            onSelectMessage={handleSelectMessage}
          />
        </Grid>
        <Grid item xs={9}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
              {selectedConversation ? (
                <List>
                  {messages[selectedListingId].map((message, index) => (
                    <MessageBubble
                      key={index}
                      content={message.content}
                      isSender={message.sender_id === 'user-1'}
                    />
                  ))}
                </List>
              ) : (
                <Typography variant="h6">Select a conversation</Typography>
              )}
            </Box>
            {selectedConversation && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 2,
                  borderTop: '1px solid #f0f0f0',
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
                <IconButton color="primary" onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Messaging
