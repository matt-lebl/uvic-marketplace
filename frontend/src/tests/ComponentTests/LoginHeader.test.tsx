import React from 'react'
import { render, screen } from '@testing-library/react'
import LoginHeader from '../../pages/Components/LoginHeader'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders listing page', () => {
  render(<LoginHeader />)
  const linkElement = screen.getByText(/UVic Marketplace/i)
  expect(linkElement).toBeInTheDocument()
})