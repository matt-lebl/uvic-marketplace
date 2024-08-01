import React from 'react'
import { render, screen } from '@testing-library/react'
import SellerCard from '../../pages/Components/SellerCard'
import { ListingEntity } from '../../interfaces'
jest.mock('react-leaflet', () => jest.fn());
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))
const mockListingEntity: ListingEntity = {
  listingID: '1',
  seller_profile: {
    userID: '123',
    username: 'selleruser',
    name: 'Seller Name',
    bio: 'Seller bio',
    profilePictureUrl: 'http://example.com/profile.jpg',
  },
  title: 'Sample Listing Title',
  description: 'Sample Listing Description',
  price: 100,
  location: {
    latitude: 40.7128,
    longitude: -74.006,
  },
  status: 'Active',
  dateCreated: '2023-01-01T00:00:00.000Z',
  dateModified: '2023-01-02T00:00:00.000Z',
  reviews: [
    {
      listing_review_id: '1',
      reviewerName: 'Reviewer',
      stars: 5,
      comment: 'Great listing!',
      userID: '456',
      listingID: '1',
      dateCreated: '2023-01-01T00:00:00.000Z',
      dateModified: '2023-01-02T00:00:00.000Z',
    },
  ],
  images: [
    {
      url: 'http://example.com/image.jpg',
    },
  ],
  distance: 10,
}

describe('SellerCard Component', () => {
  test('renders seller card with correct data', () => {
    render(<SellerCard data={mockListingEntity} />)

    expect(screen.getByText(/Seller Name/i)).toBeInTheDocument()
    expect(screen.getByText(/Seller bio/i)).toBeInTheDocument()
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
  })

  test('displays initials if no profile picture URL is provided', () => {
    const mockListingWithoutProfilePicture = {
      ...mockListingEntity,
      seller_profile: {
        ...mockListingEntity.seller_profile,
        profilePictureUrl: '',
      },
    }

    render(<SellerCard data={mockListingWithoutProfilePicture} />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveTextContent('SN')
  })
})
