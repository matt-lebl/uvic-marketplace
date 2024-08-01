// import React from 'react'
// import { render } from '@testing-library/react'
// import EditListing from '../pages/EditListing'
// import { MemoryRouter } from 'react-router-dom'

// test('renders edit-listing page', () => {
//   const { container } = render(<MemoryRouter><EditListing /></MemoryRouter>)

//   expect(container.firstChild).toHaveClass('Create-Listing')
// })

// test('renders photogallery', () => {
//   const { container } = render(<MemoryRouter><EditListing /></MemoryRouter>)

//   expect(container.getElementsByClassName('Photo-Previews').length).toBe(1)
// })
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import EditListing from '../pages/EditListing'
import { APIGet, APIPatch } from '../APIlink'
import { ListingEntity, PatchListing } from '../interfaces'

jest.mock('../APIlink', () => ({
  APIGet: jest.fn(),
  APIPatch: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: () => ({ listingID: '123' }),
}))

const mockAPIGet = APIGet as jest.MockedFunction<typeof APIGet>
const mockAPIPatch = APIPatch as jest.MockedFunction<typeof APIPatch>

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
  charityId: ''
}

describe('EditListing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders edit-listing page', async () => {
    mockAPIGet.mockResolvedValueOnce(mockListing)

    render(
      <MemoryRouter>
        <EditListing />
      </MemoryRouter>
    )

    expect(mockAPIGet).toHaveBeenCalledTimes(1)
    expect(mockAPIGet).toHaveBeenCalledWith(`/api/listing/${mockListing.listingID}`)

    await screen.findByText('Edit Listing')
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Price')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  test('updates listing when form is submitted', async () => {
    const mockReturnlisting: PatchListing = {
      listing: {
        title: 'Updated Title',
        description: 'Updated Description',
        price: 20,
        location: { latitude: 0, longitude: 0 },
        images: [],
        markedForCharity: false,
      },
      status: 'AVAILABLE'
    }

    mockAPIGet.mockResolvedValueOnce(mockListing)
    render(
      <MemoryRouter>
        <EditListing />
      </MemoryRouter>
    )

    expect(mockAPIGet).toHaveBeenCalledTimes(1)
    expect(APIGet).toHaveBeenCalledWith('/api/listing/undefined')

    await screen.findByText('Edit Listing')

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Title' },
    })
    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '20' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Updated Description' },
    })

    fireEvent.click(screen.getByText('Submit'))
    expect(APIPatch).toHaveBeenCalledTimes(1)
    expect(APIPatch).toHaveBeenCalledWith('/api/listing/undefined', mockReturnlisting)
  })
})