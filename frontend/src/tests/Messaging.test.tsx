import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Messaging from '../pages/Messaging'
import { APIGet, APIPost } from '../APIlink'

jest.mock('../APIlink', () => ({
  APIGet: jest.fn(),
  APIPost: jest.fn(),
}))

const mockThreads = [
  {
    listing_id: 'listing-1',
    other_participant: {
      user_id: 'user-2',
      name: 'User Two',
      profilePicture: '',
    },
    last_message: { content: 'Hello', sent_at: Date.now() },
  },
]

const mockMessages = [
  {
    sender_id: 'user-1',
    receiver_id: 'user-2',
    content: 'Hi',
    sent_at: Date.now(),
  },
]

describe('Messaging Component', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'userID') {
        return 'user-1'
      }
      return null
    })
    ;(APIGet as jest.Mock).mockImplementation((url) => {
      if (url === '/api/messages/overview') {
        return Promise.resolve(mockThreads)
      }
      if (url.startsWith('/api/messages/thread')) {
        return Promise.resolve(mockMessages)
      }
      if (url.startsWith('/api/user')) {
        return Promise.resolve({
          userID: 'user-3',
          name: 'User Three',
          profileUrl: '',
        })
      }
      return Promise.resolve([])
    })
    ;(APIPost as jest.Mock).mockResolvedValue({})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders without crashing', async () => {
    render(<Messaging />)
    await waitFor(() =>
      expect(APIGet).toHaveBeenCalledWith('/api/messages/overview')
    )
    const userTwoElements = screen.getAllByText('User Two')
    expect(userTwoElements.length).toBeGreaterThan(0)
  })

  test('fetches and displays messages', async () => {
    render(<Messaging />)
    await waitFor(() =>
      expect(APIGet).toHaveBeenCalledWith('/api/messages/overview')
    )
    const userTwoElements = screen.getAllByText('User Two')
    expect(userTwoElements.length).toBeGreaterThan(0)
    await waitFor(() =>
      expect(APIGet).toHaveBeenCalledWith(
        '/api/messages/thread/listing-1/user-1'
      )
    )
    const messageElements = await screen.findAllByText('Hi')
    expect(messageElements.length).toBeGreaterThan(0)
  })

  test('handles sending a new message', async () => {
    render(<Messaging />)
    await waitFor(() =>
      expect(APIGet).toHaveBeenCalledWith('/api/messages/overview')
    )

    const input = screen.getByPlaceholderText('Write a message')
    fireEvent.change(input, { target: { value: 'New message' } })
    fireEvent.click(screen.getByLabelText('send message'))

    await waitFor(() =>
      expect(APIPost).toHaveBeenCalledWith(
        `/api/messages/thread/listing-1/user-1`,
        expect.objectContaining({ content: 'New message' })
      )
    )
    const messageElements = await screen.findAllByText('New message')
    expect(messageElements.length).toBeGreaterThan(0)
  })

  test('dialog opens on starting a new conversation', async () => {
    render(<Messaging />)

    fireEvent.click(screen.getByTestId('create-message-button'))

    const dialogTitle = await screen.findByText('New Conversation')

    expect(dialogTitle).toBeInTheDocument()
  })
})
