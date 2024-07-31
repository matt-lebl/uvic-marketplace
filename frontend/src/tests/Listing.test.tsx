import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Listing from '../pages/Listing'
import { ListingEntity } from '../interfaces'

const mockListing: ListingEntity = {
  title: 'Test Listing',
  description: 'This is a test listing',
  listingID: '123',
  price: 100,
  images: [{ url: 'https://example.com/image1.jpg' }],
  seller_profile: {
    userID: '456',
    username: 'testuser',
    name: 'Test User',
    bio: 'This is a test bio',
    profilePictureUrl: 'https://example.com/profile.jpg',
  },
  location: { latitude: 48.4719, longitude: -123.3301 },
  status: 'open',
  dateCreated: '2021-01-01',
  dateModified: '2021-01-02',
  reviews: [
    {
      listing_review_id: '789',
      reviewerName: 'Test Reviewer',
      stars: 5,
      comment: 'This is a test review',
      userID: '101',
      listingID: '123',
      dateCreated: '2021-01-03',
      dateModified: '2021-01-04',
    },
  ],
  distance: 5,
}

describe('Listing Component', () => {
  test('renders Listing component', () => {
    render(<Listing listingData={mockListing} />)
    const listingTitleElements = screen.getAllByText(/Test Listing/i)
    expect(listingTitleElements.length).toBe(2)
    expect(screen.getByText(/This is a test listing/i)).toBeInTheDocument()
  })

  test('displays listing price', () => {
    render(<Listing listingData={mockListing} />)
    expect(screen.getByText(/100/i)).toBeInTheDocument()
  })

  test('displays seller information', () => {
    render(<Listing listingData={mockListing} />)
    expect(screen.getByText(/Test User/i)).toBeInTheDocument()
  })
})
