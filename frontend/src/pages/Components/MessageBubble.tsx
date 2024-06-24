import React from 'react'
import { Box, Typography } from '@mui/material'

interface MessageBubbleProps {
  content: string
  isSender: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isSender }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isSender ? 'flex-end' : 'flex-start',
        padding: '8px',
      }}
    >
      <Box
        sx={{
          backgroundColor: isSender ? '#d1e7ff' : '#f0f0f0',
          color: isSender ? '#000' : '#000',
          padding: '10px',
          borderRadius: '10px',
          maxWidth: '70%',
        }}
      >
        <Typography variant="body1">{content}</Typography>
      </Box>
    </Box>
  )
}

export default MessageBubble
