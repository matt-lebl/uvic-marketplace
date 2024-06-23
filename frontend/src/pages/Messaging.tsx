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
import Message from './Components/Message'
import SendIcon from '@mui/icons-material/Send'

const conversations = [
  {
    listing_id: 'L23434B090934',
    other_participant: {
      user_id: 'A23434B090934',
      name: 'John Doe',
      profilePicture: 'https://example.com/image1.png',
    },
    last_message: {
      sender_id: 'A23434B090934',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090934',
      content: 'Hello, is this still available?',
      sent_at: 1625247600,
    },
  },
  {
    listing_id: 'L23434B090935',
    other_participant: {
      user_id: 'A23434B090934',
      name: 'Jane Doe',
      profilePicture: 'https://example.com/image2.png',
    },
    last_message: {
      sender_id: 'A23434B090934',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090935',
      content: 'Hello, is this still available?',
      sent_at: 1625247600,
    },
  },
  {
    listing_id: 'L23434B090936',
    other_participant: {
      user_id: 'A23434B090937',
      name: 'Alice Johnson',
      profilePicture: 'https://example.com/image3.png',
    },
    last_message: {
      sender_id: 'A23434B090937',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090936',
      content: 'Can you provide more details?',
      sent_at: 1625248600,
    },
  },
  {
    listing_id: 'L23434B090937',
    other_participant: {
      user_id: 'A23434B090938',
      name: 'Bob Smith',
      profilePicture: 'https://example.com/image4.png',
    },
    last_message: {
      sender_id: 'A23434B090938',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090937',
      content: 'Is the price negotiable?',
      sent_at: 1625249600,
    },
  },
  {
    listing_id: 'L23434B090938',
    other_participant: {
      user_id: 'A23434B090939',
      name: 'Charlie Davis',
      profilePicture: 'https://example.com/image5.png',
    },
    last_message: {
      sender_id: 'A23434B090939',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090938',
      content: 'When can I see it?',
      sent_at: 1625250600,
    },
  },
  {
    listing_id: 'L23434B090939',
    other_participant: {
      user_id: 'A23434B090940',
      name: 'David Evans',
      profilePicture: 'https://example.com/image6.png',
    },
    last_message: {
      sender_id: 'A23434B090940',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090939',
      content: "I'm interested, let's talk.",
      sent_at: 1625251600,
    },
  },
  {
    listing_id: 'L23434B090940',
    other_participant: {
      user_id: 'A23434B090941',
      name: 'Eva Green',
      profilePicture: 'https://example.com/image7.png',
    },
    last_message: {
      sender_id: 'A23434B090941',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090940',
      content: 'Is this item new?',
      sent_at: 1625252600,
    },
  },
  {
    listing_id: 'L23434B090941',
    other_participant: {
      user_id: 'A23434B090942',
      name: 'Fiona Harris',
      profilePicture: 'https://example.com/image8.png',
    },
    last_message: {
      sender_id: 'A23434B090942',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090941',
      content: 'Can I come by tomorrow?',
      sent_at: 1625253600,
    },
  },
  {
    listing_id: 'L23434B090942',
    other_participant: {
      user_id: 'A23434B090943',
      name: 'George Ivan',
      profilePicture: 'https://example.com/image9.png',
    },
    last_message: {
      sender_id: 'A23434B090943',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090942',
      content: 'Can you hold it for me?',
      sent_at: 1625254600,
    },
  },
  {
    listing_id: 'L23434B090943',
    other_participant: {
      user_id: 'A23434B090944',
      name: 'Hannah Jacobs',
      profilePicture: 'https://example.com/image10.png',
    },
    last_message: {
      sender_id: 'A23434B090944',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090943',
      content: "What's the condition of this?",
      sent_at: 1625255600,
    },
  },
]

const messages = [
  {
    sender_id: 'A23434B090934',
    receiver_id: 'A23434B090936',
    listing_id: 'L23434B090934',
    content: 'Hello, is this still available?',
    sent_at: 1625247600,
  },
  {
    sender_id: 'A23434B090936',
    receiver_id: 'A23434B090934',
    listing_id: 'L23434B090934',
    content: 'Yes, it is still available.',
    sent_at: 1625248200,
  },
  {
    sender_id: 'A23434B090934',
    receiver_id: 'A23434B090936',
    listing_id: 'L23434B090934',
    content: 'Great! Can I come by tomorrow to check it out?',
    sent_at: 1625248800,
  },
  {
    sender_id: 'A23434B090936',
    receiver_id: 'A23434B090934',
    listing_id: 'L23434B090934',
    content: 'Sure, what time works for you?',
    sent_at: 1625249400,
  },
  {
    sender_id: 'A23434B090934',
    receiver_id: 'A23434B090936',
    listing_id: 'L23434B090934',
    content: 'How about 10 AM?',
    sent_at: 1625250000,
  },
  {
    sender_id: 'A23434B090936',
    receiver_id: 'A23434B090934',
    listing_id: 'L23434B090934',
    content: '10 AM works for me. See you then!',
    sent_at: 1625250600,
  },
  {
    sender_id: 'A23434B090934',
    receiver_id: 'A23434B090936',
    listing_id: 'L23434B090934',
    content: 'Great, see you tomorrow!',
    sent_at: 1625251200,
  },
]

const Messaging: React.FC = () => {
  const [selectedListingId, setSelectedListingId] = useState<string>(
    conversations[0].listing_id
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

  const selectedConversation = conversations.find(
    (conversation) => conversation.listing_id === selectedListingId
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3} sx={{ height: '100%' }}>
          <MessageSidebar
            selectedListingId={selectedListingId}
            onCreateMessage={handleNewConversation}
            messages={conversations}
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
                  {messages.map((msg, index) => (
                    <Message
                      key={index}
                      content={msg.content}
                      isSender={msg.sender_id === 'A23434B090936'}
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
