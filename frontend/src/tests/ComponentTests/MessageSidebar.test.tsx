import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import MessageSidebar from '../../pages/Components/MessageSidebar'

const messages = [
  {
    listing_id: 'L23434B090934',
    other_participant: {
      user_id: 'A23434B090934',
      name: 'John Doe',
      profilePicture: 'https://example.com/image1.png',
    },
    last_message: {
      sender_id: 'A23434B090934',
      receiver_id: 'A23434B090936',
      listing_id: 'L23434B090934',
      content: 'Hello, is this still available?',
      sent_at: 1625247600,
    },
  },
]

test('renders messages in the sidebar', () => {
  const { getByText } = render(
    <MessageSidebar
      messages={messages}
      onSelectMessage={() => {}}
      onCreateMessage={() => {}}
      selectedListingId="L23434B090934"
    />
  )
  expect(getByText('John Doe')).toBeInTheDocument()
})

test('triggers onSelectMessage handler when a message is clicked', () => {
  const handleSelectMessage = jest.fn()
  const { getByText } = render(
    <MessageSidebar
      messages={messages}
      onSelectMessage={handleSelectMessage}
      onCreateMessage={() => {}}
      selectedListingId="L23434B090934"
    />
  )
  fireEvent.click(getByText('John Doe'))
  expect(handleSelectMessage).toHaveBeenCalledTimes(1)
})

test('triggers onCreateMessage handler when the create button is clicked', () => {
  const handleCreateMessage = jest.fn()
  const { getByRole } = render(
    <MessageSidebar
      messages={messages}
      onSelectMessage={() => {}}
      onCreateMessage={handleCreateMessage}
      selectedListingId="L23434B090934"
    />
  )
  fireEvent.click(getByRole('button'))
  expect(handleCreateMessage).toHaveBeenCalledTimes(1)
})
