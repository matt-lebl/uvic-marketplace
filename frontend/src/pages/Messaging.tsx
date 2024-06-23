import React, { useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import MessageSidebar from './Components/MessageSidebar'

const messages = [
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

const Messaging: React.FC = () => {
  const [selectedListingId, setSelectedListingId] = useState<string>(
    messages[0].listing_id
  )

  const handleNewMessage = () => {
    console.log('New message')
  }

  const handleSelectMessage = (listing_id: string) => {
    setSelectedListingId(listing_id)
  }

  const selectedConversation = messages.find(
    (message) => message.listing_id === selectedListingId
  )

  return (
    <Box sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3} sx={{ height: '100%' }}>
          <MessageSidebar
            selectedListingId={selectedListingId}
            onCreateMessage={handleNewMessage}
            messages={messages}
            onSelectMessage={handleSelectMessage}
          />
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ padding: 2 }}>
            {selectedConversation ? (
              <Box>
                <Typography variant="h6">
                  Chat with {selectedConversation.other_participant.name}
                </Typography>
                <Typography variant="body1">
                  {selectedConversation.last_message.content}
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6">Select a conversation</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Messaging
