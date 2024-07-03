import React from 'react'
import { render, screen } from '@testing-library/react'
import SellerCard from '../../pages/Components/SellerCard'
import { ListingEntity } from '../../interfaces'

describe('Seller Card Component', () => {
  let sellerCard: HTMLElement
  beforeAll(async () => {
    const testListing: ListingEntity = {
        listingID: 'A23F29039B23',
        title: 'Used Calculus Textbook',
        seller_profile: {
          userID: 'A12334B345',
          username: 'hubert123',
          name: 'Bartholomew Hubert',
          bio: 'I love stuff',
          profilePictureUrl: 'https://example.com/image.png',
        },
        description: 'No wear and tear, drop-off available.',
        price: 50,
        location: {
          latitude: 34.23551,
          longitude: -104.54451,
        },
        status: 'AVAILABLE',
        dateCreated: '2024-05-23T15:30:00Z',
        dateModified: '2024-05-23T15:30:00Z',
        reviews: [
          {
            listing_review_id: 'A23F29039B23',
            reviewerName: 'John Doe',
            stars: 5,
            comment:
              'Great seller, the item was exactly as described and in perfect condition.',
            userID: 'A23434B090934',
            listingID: 'A23F29039B23',
            dateCreated: '2024-05-23T15:30:00Z',
            dateModified: '2024-05-23T15:30:00Z',
          },
        ],
        images: [
          {
            url: 'https://example.com/image',
          },
        ],
        distance: 4.2,
    }
    const {container} = render(<SellerCard listing={testListing} />)
    sellerCard = container;
  })

  test('renders seller card', () => {
    expect(sellerCard.firstChild).toHaveClass('Seller-Card')
    //Profile Pic Exists
    //Start Messaging Button Exists. Check it navs you to messaging system.
    //Map with longitude lattitdue
    //Listing Title. Check it matches
    //Status section
    //Check Price
    //Check description
    //Date Created Section
    //Date modified section
    //Check image gallery exists.
  })
})
