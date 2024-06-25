import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Messaging from '../pages/Messaging'
import { MessageSidebarProps } from '../pages/Components/MessageSidebar'
import { MessageBubbleProps } from '../pages/Components/MessageBubble'
import { MessageThread } from '../interfaces'

jest.mock('../pages/Components/MessageSidebar', () => {
  const MockMessageSidebar = (props: MessageSidebarProps) => (
    <div data-testid="message-sidebar">
      {props.messages.map((message: MessageThread) => (
        <div
          key={message.listing_id}
          onClick={() => props.onSelectMessage(message.listing_id)}
        >
          {message.other_participant.name}
        </div>
      ))}
      <button
        data-testid="create-message-button"
        onClick={props.onCreateMessage}
      >
        New Conversation
      </button>
    </div>
  )
  MockMessageSidebar.displayName = 'MockMessageSidebar'
  return MockMessageSidebar
})

jest.mock('../pages/Components/MessageBubble', () => {
  const MockMessageBubble = (props: MessageBubbleProps) => (
    <div data-testid="message-bubble">{props.content}</div>
  )
  MockMessageBubble.displayName = 'MockMessageBubble'
  return MockMessageBubble
})

describe('Messaging Component', () => {
  it('renders the message sidebar', () => {
    render(<Messaging />)
    expect(screen.getByTestId('message-sidebar')).toBeInTheDocument()
  })

  it('opens the new conversation dialog when the new conversation button is clicked', () => {
    render(<Messaging />)
    fireEvent.click(screen.getByTestId('create-message-button'))
    expect(screen.getByText('New Conversation')).toBeInTheDocument()
  })

  it('creates a new conversation', async () => {
    render(<Messaging />)
    fireEvent.click(screen.getByTestId('create-message-button'))
    fireEvent.change(screen.getByLabelText('Participant Name'), {
      target: { value: 'New User' },
    })
    fireEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument()
    })
  })

  it('sends a new message', async () => {
    render(<Messaging />)
    fireEvent.change(screen.getByPlaceholderText('Write a message'), {
      target: { value: 'New message content' },
    })
    fireEvent.keyDown(screen.getByPlaceholderText('Write a message'), {
      key: 'Enter',
      code: 'Enter',
    })

    await waitFor(() => {
      expect(screen.getByText('New message content')).toBeInTheDocument()
    })
  })

  it('selects a conversation and displays messages', async () => {
    render(<Messaging />)
    fireEvent.click(screen.getByText('User 2'))

    await waitFor(() => {
      expect(screen.getByText('Message 1 for listing-2')).toBeInTheDocument()
    })
  })
})
