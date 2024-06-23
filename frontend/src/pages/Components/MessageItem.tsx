import React from 'react'
import { ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material'

interface MessageItemProps {
  message: {
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
  }
  onClick: () => void
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onClick }) => {
  return (
    <ListItem button onClick={onClick}>
      <ListItemAvatar>
        <Avatar src={message.other_participant.profilePicture} />
      </ListItemAvatar>
      <ListItemText
        primary={message.other_participant.name}
        secondary={message.last_message.content}
      />
    </ListItem>
  )
}

export default MessageItem
