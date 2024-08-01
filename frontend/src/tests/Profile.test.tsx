import React from 'react'
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import ProfileContainer from '../pages/Profile'
import { User } from '../interfaces'
import { APIGet } from '../APIlink'

jest.mock('../APIlink', () => ({
  APIGet: jest.fn(),
  APIDelete: jest.fn(),
  APIPatch: jest.fn(),
}))

const mockUser: User = {
  userID: '1',
  username: 'firstlast',
  name: 'First Last',
  bio: 'User Bio Here',
  profileUrl: 'https://randomuser.me/api/',
  email: 'test@gmail.com',
}

const localStorageMock = (function () {
  let store: { [key: string]: string } = {}
  return {
    getItem(key: string) {
      return store[key] || null
    },
    setItem(key: string, value: string) {
      store[key] = value
    },
    clear() {
      store = {}
    },
    removeItem(key: string) {
      delete store[key]
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

beforeEach(() => {
  localStorage.setItem('userID', mockUser.userID)
  localStorage.setItem('username', mockUser.username)
  localStorage.setItem('name', mockUser.name)
  localStorage.setItem('bio', mockUser.bio)
  localStorage.setItem('profileUrl', mockUser.profileUrl)
  localStorage.setItem('email', mockUser.email)
  ;(APIGet as jest.Mock).mockImplementation((url: string) => {
    if (url === '/api/listing') {
      return Promise.resolve([])
    }
    return Promise.resolve([])
  })
})

afterEach(() => {
  localStorage.clear()
})

describe('ProfileContainer', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ProfileContainer />
        </MemoryRouter>
      )
    })
  })

  it('renders user profile information', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('name')).toBeInTheDocument()
      expect(screen.getByTestId('username')).toBeInTheDocument()
      expect(screen.getByTestId('bio')).toBeInTheDocument()
    })
  })

  it('toggles edit mode', async () => {
    const editButton = screen.getByText('Edit')
    await act(async () => {
      fireEvent.click(editButton)
    })

    await waitFor(() => {
      expect(screen.getByTestId('edit-name')).toBeInTheDocument()
      expect(screen.getByTestId('edit-username')).toBeInTheDocument()
    })

    const saveButton = screen.getByText('Save')
    await act(async () => {
      fireEvent.click(saveButton)
    })

    await waitFor(() => {
      expect(screen.getByTestId('name')).toBeInTheDocument()
      expect(screen.getByTestId('username')).toBeInTheDocument()
      expect(screen.getByTestId('bio')).toBeInTheDocument()
    })
  })
})
