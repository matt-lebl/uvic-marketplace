import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ProfileContainer from '../pages/Profile'
import { User, ListingSummary } from '../interfaces'

const mockUser: User = {
  userID: '1',
  username: 'firstlast',
  name: 'First Last',
  bio: 'User Bio Here',
  profileUrl: 'https://randomuser.me/api/',
  email: 'test@gmail.com',
}

const mockListings: ListingSummary[] = [
  {
    listingID: '1',
    sellerID: '1',
    sellerName: 'First Last',
    title: 'Couch Item Title 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 75,
    dateCreated: '2023-01-01',
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291Y2h8ZW58MHx8MHx8fDA%3D',
  },
  {
    listingID: '2',
    sellerID: '1',
    sellerName: 'First Last',
    title: 'Couch Item Title 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 50,
    dateCreated: '2023-01-02',
    imageUrl:
      'https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvdWNofGVufDB8fDB8fHww',
  },
]

describe('ProfileContainer', () => {
  beforeEach(() => {
    render(<ProfileContainer />)
  })

  it('renders user profile information', () => {
    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument()
  })

  it('toggles edit mode', () => {
    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)
    expect(screen.getByDisplayValue(mockUser.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockUser.email)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockUser.bio)).toBeInTheDocument()

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)
    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument()
  })

  it('renders listings', () => {
    expect(screen.getByText(mockListings[0].title)).toBeInTheDocument()
    expect(screen.getByText(`$${mockListings[0].price}`)).toBeInTheDocument()
    expect(screen.getByText(mockListings[1].title)).toBeInTheDocument()
    expect(screen.getByText(`$${mockListings[1].price}`)).toBeInTheDocument()
  })

  it('paginates listings', async () => {
    fireEvent.click(screen.getByRole('button', { name: /2/i }))
    await waitFor(() => {
      expect(screen.getByText(mockListings[0].title)).toBeInTheDocument()
    })
  })
})
