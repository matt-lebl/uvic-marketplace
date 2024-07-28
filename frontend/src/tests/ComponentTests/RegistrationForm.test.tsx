import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
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

    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  test('displays validation errors for empty fields', async () => {
    render(<RegisterForm />)

    await act(async () => {
      fireEvent.click(screen.getByText(/Submit/i))
    })

    await waitFor(() => {
      expect(screen.getAllByText(/Required/i)).toHaveLength(6)
    })
  })

  test('submits the form with valid data', async () => {
    mockAPIPost.mockResolvedValueOnce({})

    render(<RegisterForm />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText('First Name'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText('Last Name'), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText('Username'), {
        target: { value: 'johndoe' },
      })
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john.doe@uvic.ca' },
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'Password123!' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'Password123!' },
      })
    })

    await act(async () => {
      fireEvent.click(screen.getByText(/Submit/i))
    })

    await waitFor(() => {
      expect(mockAPIPost).toHaveBeenCalledWith('/api/user/', {
        email: 'john.doe@uvic.ca',
        password: 'Password123!',
        username: 'johndoe',
        name: 'John Doe',
      })
      expect(mockAPIPost).toHaveBeenCalledTimes(1)
    })
  })

  test('displays error message on API failure', async () => {
    mockAPIPost.mockRejectedValueOnce(new Error('Registration failed'))

    render(<RegisterForm />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText('First Name'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText('Last Name'), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText('Username'), {
        target: { value: 'johndoe' },
      })
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john.doe@uvic.ca' },
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'Password123!' },
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'Password123!' },
      })
    })

    await act(async () => {
      fireEvent.click(screen.getByText(/Submit/i))
    })

    await waitFor(() => {
      const errorMessage = screen.queryByText((content, element) => {
        const hasText = (text: string) => text.includes('Registration failed')
        const elementHasText = hasText(element?.textContent || '')
        const childrenDontHaveText = Array.from(element?.children || []).every(
          (child) => !hasText(child.textContent || '')
        )
        return elementHasText && childrenDontHaveText
      })

      expect(errorMessage).toBeInTheDocument()
    })
  })
})
