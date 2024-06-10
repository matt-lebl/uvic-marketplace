import React from 'react'
import { render, screen } from '@testing-library/react'
import Login from '../pages/Login'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders login page', () => {
  render(<Login />)
  const linkElement = screen.getByText(/Login Page/i)
  expect(linkElement).toBeInTheDocument()
})
