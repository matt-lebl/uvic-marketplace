import React from 'react'
import { render, screen } from '@testing-library/react'
import Listing from './Listing'


// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders listing page', () => {
    render(<Listing/>)
  const linkElement = screen.getByText(/Listing Page/i)
  expect(linkElement).toBeInTheDocument()
})