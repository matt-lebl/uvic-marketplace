import React from 'react'
import {
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material'

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
  selected: boolean
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onClick,
  selected,
}) => {
  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      style={{
        borderBottom: '1px solid #f0f0f0',
        padding: '10px',
        backgroundColor: selected ? '#f0f0f0' : 'white',
        maxHeight: '10vh',
      }}
    >
      <ListItemAvatar>
        <Avatar src={message.other_participant.profilePicture} />
      </ListItemAvatar>
      <ListItemText
        primary={message.other_participant.name}
        secondary={
          <span
            style={{
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxHeight: '3em',
            }}
          >
            {message.last_message.content}
          </span>
        }
      />
    </ListItemButton>
  )
}

export default MessageItem
