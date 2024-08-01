import React from 'react'
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Listing from '../pages/Listing'
import { ListingEntity } from '../interfaces'
import { APIGet, APIPost } from '../APIlink'
import { useNavigate, useParams } from 'react-router-dom'
jest.mock('react-leaflet', () => jest.fn());
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ listingID: '123' }),
}));
jest.mock('../pages/Components/ListingMap', () => jest.fn());

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
  charityId: '789',
}
jest.mock('../APIlink', () => ({
  APIGet: jest.fn(),
  APIPost: jest.fn(),
}))
const mockAPIGet = APIGet as jest.MockedFunction<typeof APIGet>
const mockAPIPost = APIPost as jest.MockedFunction<typeof APIPost>
//has seller card
//has map component
//has reveiw component
//has api call get and post
//has message button

describe('Listing Component', () => {
  afterEach(() => {
    mockAPIGet.mockClear()
    mockAPIPost.mockClear()
    localStorage.clear()
  })

  test('renders loading state', () => {
    render(<Listing />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders "Listing not found" when listing data or listing ID is not available', async () => {
    render(<Listing />)
    await waitForElementToBeRemoved(() => screen.getByText('Loading...'), { timeout: 2000 });

    expect(screen.getByText('Listing not found')).toBeInTheDocument()
  })
  test('renders Listing component', async () => {
    localStorage.setItem('userID', '123')
    mockAPIGet.mockResolvedValueOnce(mockListing)
    render(<Listing />)

    await waitForElementToBeRemoved(() => screen.getByText('Loading...'), { timeout: 2000 });


    await waitFor(() => {
      expect(mockAPIGet).toHaveBeenCalledWith(`/api/listing/${mockListing.listingID}`)
      expect(mockAPIGet).toHaveBeenCalledTimes(1)
    })
    expect(screen.getByTestId("photoGallery")).toBeInTheDocument()
    expect(screen.getByTestId("seller-card")).toBeInTheDocument()
    expect(screen.getByTestId("Reviews")).toBeInTheDocument()
  })
  //test for edit button.
  test('test edit button', async () => {
    localStorage.setItem('userID', mockListing.seller_profile.userID)
    mockAPIGet.mockResolvedValueOnce(mockListing)

    render(<Listing />)


    await waitForElementToBeRemoved(() => screen.getByText('Loading...'), { timeout: 2000 });

    const editButton = screen.getByTestId("EditButton");
    expect(editButton).toBeInTheDocument()
    expect(editButton).toHaveTextContent("Edit")
  })
  //test for message button
  test('test message functionality', async () => {
    localStorage.setItem('userID', '123');
    mockAPIGet.mockResolvedValueOnce(mockListing);
    render(<Listing />);

    await waitForElementToBeRemoved(() => screen.getByText('Loading...'), { timeout: 2000 });

    const messageButton = screen.getByText('Send Message');
    expect(messageButton).toBeInTheDocument();
    fireEvent.click(messageButton);
    expect(mockAPIPost).toHaveBeenCalledWith('/api/messages', {
      receiver_id: mockListing.seller_profile.userID,
      listing_id: mockListing.listingID,
      content: 'Hello, I am interested in your listing!',
    });
  });
});