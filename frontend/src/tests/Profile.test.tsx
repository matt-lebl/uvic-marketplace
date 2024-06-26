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
})
