import React from 'react'
import { render, screen } from '@testing-library/react'
import Registration from './Registration'


// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders registration page', () => {
    render(<Registration/>)
  const linkElement = screen.getByText(/Register Page/i)
  expect(linkElement).toBeInTheDocument()
})