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
  it('renders the initial state correctly', () => {
    render(<Messaging />)

    expect(screen.getByTestId('message-sidebar')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Write a message')).toBeInTheDocument()
  })

  it('allows selecting a message thread', () => {
    render(<Messaging />)

    const messageSidebar = screen.getByTestId('message-sidebar')
    const firstThread = within(messageSidebar).getByText('User 1')
    fireEvent.click(firstThread)

    const conversationHeader = screen.getByRole('heading', { level: 6 })
    expect(conversationHeader).toHaveTextContent('User 1')
  })

  it('allows sending a new message', () => {
    render(<Messaging />)

    const messageInput = screen.getByPlaceholderText('Write a message')
    fireEvent.change(messageInput, { target: { value: 'Hello World' } })

    const sendButton = screen.getByLabelText('send message')
    fireEvent.click(sendButton)

    expect(screen.getByText('Hello World (You)')).toBeInTheDocument()
  })

  it('opens a dialog to create a new conversation', () => {
    render(<Messaging />)

    const newMessageButton = screen.getByText('New Message')
    fireEvent.click(newMessageButton)

    expect(screen.getByText('New Conversation')).toBeInTheDocument()
    expect(screen.getByLabelText('Participant Name')).toBeInTheDocument()
  })

  it('creates a new conversation', async () => {
    render(<Messaging />)

    const newMessageButton = screen.getByText('New Message')
    fireEvent.click(newMessageButton)

    const participantNameInput = screen.getByLabelText('Participant Name')
    fireEvent.change(participantNameInput, { target: { value: 'New User' } })

    const createButton = screen.getByText('Create')
    fireEvent.click(createButton)

    await waitFor(() => {
      const messageSidebar = screen.getByTestId('message-sidebar')
      const newUserThread = within(messageSidebar).getByText('New User')
      expect(newUserThread).toBeInTheDocument()
    })
  })
})
