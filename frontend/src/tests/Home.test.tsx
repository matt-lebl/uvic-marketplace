import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders listing page', () => {
  render(<Home />)
  const linkElement = screen.getByText(/Home Page/i)
  expect(linkElement).toBeInTheDocument()
})
