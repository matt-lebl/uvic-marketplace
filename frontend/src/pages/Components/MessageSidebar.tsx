import React from 'react'
import { List, Typography, Box } from '@mui/material'
import MessageItem from './MessageItem'

export interface MessageSidebarProps {
  messages: Array<{
    listing_id: string
    other_participant: {
      user_id: string
      name: string
      profilePicture: string
    }
    last_message: {
      sender_id: string
      receiver_id: string
      listing_id: string
      content: string
      sent_at: number
    }
  }>
  onSelectMessage: (listing_id: string) => void
  selectedListingId: string
}

const MessageSidebar: React.FC<MessageSidebarProps> = ({
  messages,
  onSelectMessage,
  selectedListingId,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        maxWidth: 360,
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Conversations</Typography>
      </Box>
      <List style={{ padding: 0 }}>
        {messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message}
            onClick={() => onSelectMessage(message.listing_id)}
            selected={message.listing_id === selectedListingId}
          />
        ))}
      </List>
    </Box>
  )
}

export default MessageSidebar
