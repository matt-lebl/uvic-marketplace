import React from 'react'
import { render, screen } from '@testing-library/react'
import EventCard from '../../pages/Components/EventCard'
import { CharityEntity } from '../../interfaces'

// Mock data for testing
const eventDataMock: CharityEntity = {
  id: '1',
  name: 'Sample Event',
  funds: 10000,
  startDate: new Date('2024-07-15').toISOString(),
  endDate: new Date('2024-07-20').toISOString(),
  imageUrl: 'sample_image_url',
  description: 'Sample event description.',
  organizations: [],
  listingsCount: 1,
}

describe('EventCard component', () => {
  it('renders event data correctly', () => {
    render(<EventCard eventData={eventDataMock} />)

    expect(screen.getByText(eventDataMock.name)).toBeInTheDocument()

    expect(screen.getByText('Funding: $10000')).toBeInTheDocument()

    const startText = screen.getByText((content) => {
      const regex = /2024-07-15, 17:00:00/
      const hasText = regex.test(content)

      return hasText
    })

    expect(startText).toBeInTheDocument()

    const endText = screen.getByText((content) => {
      const regex = /2024-07-20, 17:00:00/
      const hasText = regex.test(content)

      return hasText
    })

    expect(endText).toBeInTheDocument()

    const imageElements = screen.getAllByRole('img')
    expect(imageElements.length).toBe(1)

    const firstImage = imageElements[0]
    expect(firstImage).toHaveAttribute('src', 'sample_image_url')

    expect(screen.getByText(eventDataMock.description)).toBeInTheDocument()
  })
})
