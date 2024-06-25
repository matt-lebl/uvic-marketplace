import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import MessageSidebar from '../../pages/Components/MessageSidebar'

const messages = [
  {
    listing_id: 'listing-1',
    other_participant: {
      user_id: 'user-1',
      name: 'User 1',
      profilePicture: 'https://example.com/profile-1.jpg',
    },
    last_message: {
      sender_id: 'user-1',
      receiver_id: 'user-2',
      listing_id: 'listing-1',
      content: 'This is the last message for listing 1',
      sent_at: Date.now(),
    },
  },
  {
    listing_id: 'listing-2',
    other_participant: {
      user_id: 'user-2',
      name: 'User 2',
      profilePicture: 'https://example.com/profile-2.jpg',
    },
    last_message: {
      sender_id: 'user-2',
      receiver_id: 'user-1',
      listing_id: 'listing-2',
      content: 'This is the last message for listing 2',
      sent_at: Date.now(),
    },
  },
]

describe('MessageSidebar', () => {
  it('renders conversations list', () => {
    const { getByText } = render(
      <MessageSidebar
        messages={messages}
        onCreateMessage={() => {}}
        onSelectMessage={() => {}}
        selectedListingId="listing-1"
      />
    )

    expect(getByText('Conversations')).toBeInTheDocument()
    expect(getByText('User 1')).toBeInTheDocument()
    expect(getByText('User 2')).toBeInTheDocument()
  })

  it('calls onCreateMessage when new message button is clicked', () => {
    const onCreateMessage = jest.fn()
    const { getByTestId } = render(
      <MessageSidebar
        messages={messages}
        onCreateMessage={onCreateMessage}
        onSelectMessage={() => {}}
        selectedListingId="listing-1"
      />
    )

    fireEvent.click(getByTestId('create-message-button'))
    expect(onCreateMessage).toHaveBeenCalled()
  })

  it('calls onSelectMessage when a conversation is clicked', () => {
    const onSelectMessage = jest.fn()
    const { getByText } = render(
      <MessageSidebar
        messages={messages}
        onCreateMessage={() => {}}
        onSelectMessage={onSelectMessage}
        selectedListingId="listing-1"
      />
    )

    fireEvent.click(getByText('User 2'))
    expect(onSelectMessage).toHaveBeenCalledWith('listing-2')
  })

  it('highlights the selected conversation', () => {
    const { getByText } = render(
      <MessageSidebar
        messages={messages}
        onCreateMessage={() => {}}
        onSelectMessage={() => {}}
        selectedListingId="listing-1"
      />
    )

    const selectedConversation =
      getByText('User 1').parentElement?.parentElement
    expect(selectedConversation).toHaveStyle('background-color: #f0f0f0')
  })
})
