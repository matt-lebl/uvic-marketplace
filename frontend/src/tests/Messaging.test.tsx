import React from 'react'
import { render, screen } from '@testing-library/react'
import Messaging from '../pages/Messaging'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders listing page', () => {
  render(<Messaging />)
  const linkElement = screen.getByText(/UVic Marketplace/i)
  expect(linkElement).toBeInTheDocument()
})
