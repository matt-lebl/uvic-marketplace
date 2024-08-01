import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
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
    ;(APIPost as jest.Mock).mockResolvedValue({
      sender_id: 'user-1',
      receiver_id: 'user-2',
      content: 'New message',
      sent_at: Date.now(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders without crashing', async () => {
    render(
      <BrowserRouter>
        <Messaging />
      </BrowserRouter>
    )
    await waitFor(() =>
      expect(APIGet).toHaveBeenCalledWith('/api/messages/overview')
    )
    const userTwoElements = screen.getAllByText('User Two')
    expect(userTwoElements.length).toBeGreaterThan(0)
  })

  test('fetches and displays messages', async () => {
    render(
      <BrowserRouter>
        <Messaging />
      </BrowserRouter>
    )
    await waitFor(() =>
      expect(APIGet).toHaveBeenCalledWith('/api/messages/overview')
    )
    const userTwoElements = screen.getAllByText('User Two')
    expect(userTwoElements.length).toBeGreaterThan(0)
    await waitFor(() =>
      expect(APIGet).toHaveBeenCalledWith(
        '/api/messages/thread/listing-1/user-2'
      )
    )
    const messageElements = await screen.findAllByText('Hi')
    expect(messageElements.length).toBeGreaterThan(0)
  })

  test('handles sending a new message', async () => {
    render(
      <BrowserRouter>
        <Messaging />
      </BrowserRouter>
    )
    await waitFor(() =>
      expect(APIGet).toHaveBeenCalledWith('/api/messages/overview')
    )

    const input = screen.getByPlaceholderText('Write a message')
    fireEvent.change(input, { target: { value: 'New message' } })
    fireEvent.click(screen.getByLabelText('send message'))

    await waitFor(() =>
      expect(APIPost).toHaveBeenCalledWith(
        `/api/messages`,
        expect.objectContaining({
          content: 'New message',
          listing_id: 'listing-1',
          receiver_id: 'user-2',
        })
      )
    )

    const messageElements = await screen.findAllByText((content, element) => {
      return content === 'New message'
    })
    expect(messageElements.length).toBeGreaterThan(0)
  })
})
