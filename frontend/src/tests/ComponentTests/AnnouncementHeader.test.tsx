import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import AnnouncementHeader from '../../pages/Components/AnnouncementHeader'
import { APIGet } from '../../APIlink'
import { CharityEntity } from '../../interfaces'

jest.mock('../../APIlink', () => ({
  APIGet: jest.fn(),
}))

const mockCharity: CharityEntity = {
  id: '1',
  name: 'Mock Charity Event',
  description: 'This is a mock charity event for testing purposes.',
  startDate: new Date(),
  endDate: new Date(),
  imageUrl: 'mock-image-url',
  organizations: [
    {
      name: 'Mock Organization',
      logoUrl: 'mock-logo-url',
      donated: 1000,
      received: true,
    },
  ],
  funds: 5000,
  listingsCount: 10,
}

describe('AnnouncementHeader', () => {
  beforeEach(() => {
    (APIGet as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockCharity)
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders the announcement header with charity data', async () => {
    render(<AnnouncementHeader />)

    await waitFor(() => {
      expect(screen.getByText(/Current Charity Event:/)).toBeInTheDocument()
      expect(screen.getByText(/Mock Charity Event/)).toBeInTheDocument()
      expect(screen.getByText(/Amount Raised: \$5000/)).toBeInTheDocument()
    })
  })

  test('handles API errors by displaying mock charity data', async () => {
    (APIGet as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('API error'))
    )
    render(<AnnouncementHeader />)

    await waitFor(() => {
      expect(screen.getByText(/Current Charity Event:/)).toBeInTheDocument()
      expect(screen.getByText(/Mock Charity Event/)).toBeInTheDocument()
      expect(screen.getByText(/Amount Raised: \$5000/)).toBeInTheDocument()
    })
  })
})
