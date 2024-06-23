import React from 'react'
import { Box, Typography } from '@mui/material'

interface MessageProps {
  content: string
  isSender: boolean
}

const Message: React.FC<MessageProps> = ({ content, isSender }) => {
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

export default Message
