import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import MessageItem from '../../pages/Components/MessageItem'

const message = {
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
}

test('renders message item content', () => {
  const { getByText } = render(
    <MessageItem message={message} onClick={() => {}} selected={false} />
  )
  expect(getByText('John Doe')).toBeInTheDocument()
  expect(getByText('Hello, is this still available?')).toBeInTheDocument()
})

test('triggers onClick handler when clicked', () => {
  const handleClick = jest.fn()
  const { getByText } = render(
    <MessageItem message={message} onClick={handleClick} selected={false} />
  )
  fireEvent.click(getByText('John Doe'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
