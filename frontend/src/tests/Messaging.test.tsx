import React from 'react'
import {
  render,
  fireEvent,
  screen,
  within,
  waitFor,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Messaging from '../pages/Messaging'
import { MessageSidebarProps } from '../pages/Components/MessageSidebar'
import { MessageBubbleProps } from '../pages/Components/MessageBubble'
import { MessageThread } from '../interfaces'

jest.mock('../pages/Components/MessageSidebar', () => {
  const MessageSidebar = (props: MessageSidebarProps) => (
    <div data-testid="message-sidebar">
      {props.messages.map((message: MessageThread) => (
        <div
          key={message.listing_id}
          onClick={() => props.onSelectMessage(message.listing_id)}
        >
          {message.other_participant.name}
        </div>
      ))}
      <button onClick={props.onCreateMessage}>New Message</button>
    </div>
  )
  MessageSidebar.displayName = 'MessageSidebar'
  return MessageSidebar
})

jest.mock('../pages/Components/MessageBubble', () => {
  const MessageBubble = (props: MessageBubbleProps) => (
    <div data-testid="message-bubble">
      {props.content} {props.isSender ? '(You)' : ''}
    </div>
  )
  MessageBubble.displayName = 'MessageBubble'
  return MessageBubble
})

describe('Messaging Component', () => {
  it('opens a dialog to create a new conversation', () => {
    render(<Messaging />)

    const newMessageButton = screen.getByText('New Message')
    fireEvent.click(newMessageButton)

    expect(screen.getByText('New Conversation')).toBeInTheDocument()
    expect(screen.getByLabelText('Participant Name')).toBeInTheDocument()
  })
})
