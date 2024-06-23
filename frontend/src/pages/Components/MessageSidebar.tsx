import React from 'react'
import { List, Typography, Box } from '@mui/material'
import MessageItem from './MessageItem'

interface MessageSidebarProps {
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
}

const MessageSidebar: React.FC<MessageSidebarProps> = ({
  messages,
  onSelectMessage,
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
      <Typography variant="h6" style={{ padding: '10px' }}>
        Conversations
      </Typography>
      <List>
        {messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message}
            onClick={() => onSelectMessage(message.listing_id)}
          />
        ))}
      </List>
    </Box>
  )
}

export default MessageSidebar
