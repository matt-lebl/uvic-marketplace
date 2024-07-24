import * as React from 'react'
import Events from '../pages/Events'
import { CharityEntity } from '../interfaces'
import { render, act, waitFor, screen } from '@testing-library/react'
import axios from 'axios'
import { APIGet } from '../APIlink'

jest.mock('../APIlink', () => {
  return {
    APIGet: jest.fn(),
  }
})

describe('Events page tests', () => {
  beforeEach(() => {
    ;(APIGet as jest.Mock).mockImplementation(async (url: string) => {
      if (url === '/api/charities/current') {
        return {
          id: '1',
          name: 'Test Event',
          description: 'Test description',
          startDate: Date.now(),
          endDate: Date.now() + 3600000,
          imageUrl: 'https://example.com/image.jpg',
          organizations: [],
          funds: 1000,
          listingsCount: 10,
        } as CharityEntity
      } else if (url === '/api/charities') {
        return [
          {
            id: '2',
            name: 'Second Event',
            description: 'Another event description',
            startDate: Date.now() + 86400000,
            endDate: Date.now() + 90000000,
            imageUrl: 'https://example.com/second-image.jpg',
            organizations: [],
            funds: 500,
            listingsCount: 5,
          } as CharityEntity,
        ]
      }
    })
  })

  it('renders main charity event and other events', async () => {
    render(<Events />)

    await waitFor(() => {
      expect(APIGet).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText('Charity Events')).toBeInTheDocument()
    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Second Event')).toBeInTheDocument()
  })

  it('handles API fetch error', async () => {
    ;(APIGet as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    render(<Events />)

    await waitFor(() => {
      expect(APIGet).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText('Charity Events')).toBeInTheDocument()
    expect(screen.getByText('Event not found')).toBeInTheDocument()
  })
})
