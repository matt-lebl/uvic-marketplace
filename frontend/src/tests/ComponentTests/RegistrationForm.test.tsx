import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterForm from '../../pages/Components/RegistrationForm'
import { APIPost } from '../../APIlink'

jest.mock('../../APIlink', () => ({
  APIPost: jest.fn(),
}))

const mockAPIPost = APIPost as jest.MockedFunction<typeof APIPost>

describe('RegisterForm', () => {
  beforeEach(() => {
    mockAPIPost.mockClear()
  })

  test('renders the form fields', () => {
    render(<RegisterForm />)

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
  })

  test('displays validation errors for empty fields', async () => {
    render(<RegisterForm />)

    fireEvent.click(screen.getByText(/Submit/i))

    await waitFor(() => {
      expect(screen.getByText(/Required/i)).toBeInTheDocument()
    })
  })

  test('submits the form with valid data', async () => {
    mockAPIPost.mockResolvedValueOnce({})

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'johndoe' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByText(/Submit/i))

    await waitFor(() => {
      expect(mockAPIPost).toHaveBeenCalledWith('/api/user/', {
        username: 'johndoe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      })
      expect(mockAPIPost).toHaveBeenCalledTimes(1)
    })
  })

  test('displays error message on API failure', async () => {
    mockAPIPost.mockRejectedValueOnce(new Error('Registration failed'))

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'johndoe' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByText(/Submit/i))

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument()
    })
  })
})
