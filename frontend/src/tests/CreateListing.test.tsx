import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateListing from '../pages/CreateListing'
import { APIPost } from '../APIlink'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../APIlink', () => ({
  APIPost: jest.fn(),
}))

beforeAll(() => {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn(),
    },
    writable: true,
  })
})

describe('CreateListing Component', () => {
  beforeEach(() => {
    jest
      .spyOn(navigator.geolocation, 'getCurrentPosition')
      .mockImplementation((success) =>
        success({
          coords: {
            latitude: 48.4719,
            longitude: -123.3302,
            accuracy: 100,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        })
      )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders CreateListing component', () => {
    render(<MemoryRouter><CreateListing /></MemoryRouter>)
    expect(screen.getByText(/New Listing/i)).toBeInTheDocument()
  })

  test('validates required fields', async () => {
    render(<MemoryRouter><CreateListing /></MemoryRouter>)

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Price is required/i)).toBeInTheDocument()
    })
  })

  test('handles input changes', () => {
    render(<MemoryRouter><CreateListing /></MemoryRouter>)

    fireEvent.change(screen.getByLabelText(/Listing Title/i), {
      target: { value: 'Test Title' },
    })
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: '50' },
    })

    expect(screen.getByLabelText(/Listing Title/i)).toHaveValue('Test Title')
    expect(screen.getByLabelText(/Price/i)).toHaveValue('50')
  })

  test('submits the form with correct data', async () => {
    ;(APIPost as jest.Mock).mockResolvedValue({ success: true })

    render(<MemoryRouter><CreateListing /></MemoryRouter>)

    fireEvent.change(screen.getByLabelText(/Listing Title/i), {
      target: { value: 'Test Title' },
    })
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: '50' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

    await waitFor(() => {
      expect(APIPost).toHaveBeenCalledWith('/api/listing', {
        listing: {
          title: 'Test Title',
          description: '',
          price: 50,
          location: {
            latitude: 48.4719,
            longitude: -123.3302,
          },
          images: [],
          markedForCharity: false,
        },
      })
    })
  })
})
