import React from 'react'
import { render, screen } from '@testing-library/react'
import Login from '../pages/Login'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders login page', () => {
  // Test if the login page renders
  render(<Login />)
  const linkElement = screen.getByText(/Login/i)
  expect(linkElement).toBeInTheDocument()

  // Test if the login form renders
  const loginForm = screen.getByTestId('login-form')
  expect(loginForm).toBeInTheDocument()
})
