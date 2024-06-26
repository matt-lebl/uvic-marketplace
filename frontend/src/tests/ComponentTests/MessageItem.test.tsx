import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import MessageItem from '../../pages/Components/MessageItem'

const message = {
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
    content:
      'This is a test message content that is quite long to see if the text gets truncated properly in the UI.',
    sent_at: Date.now(),
  },
}

describe('MessageItem', () => {
  it('renders message details correctly', () => {
    const { getByText, getByAltText } = render(
      <MessageItem message={message} onClick={() => {}} selected={false} />
    )

    expect(getByText('User 1')).toBeInTheDocument()
    expect(
      getByText(
        'This is a test message content that is quite long to see if the text gets truncated properly in the UI.'
      )
    ).toBeInTheDocument()
    expect(getByAltText('profile picture')).toHaveAttribute(
      'src',
      'https://example.com/profile-1.jpg'
    )
  })

  it('applies the selected style when selected', () => {
    const { getByRole } = render(
      <MessageItem message={message} onClick={() => {}} selected={true} />
    )

    const listItemButton = getByRole('button')
    expect(listItemButton).toHaveStyle('background-color: #f0f0f0')
  })

  it('does not apply the selected style when not selected', () => {
    const { getByRole } = render(
      <MessageItem message={message} onClick={() => {}} selected={false} />
    )

    const listItemButton = getByRole('button')
    expect(listItemButton).toHaveStyle('background-color: white')
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <MessageItem message={message} onClick={handleClick} selected={false} />
    )

    fireEvent.click(getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
