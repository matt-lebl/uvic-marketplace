import React from 'react'
import { List } from '@mui/material'
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
    <List>
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          onClick={() => onSelectMessage(message.listing_id)}
        />
      ))}
    </List>
  )
}

export default MessageSidebar
