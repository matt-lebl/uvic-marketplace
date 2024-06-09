import React from 'react'
import { render, screen } from '@testing-library/react'
import Index from '../pages/Index'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders hello world', () => {
  render(<Index />)
  const linkElement = screen.getByText(/Hello World!/i)
  expect(linkElement).toBeInTheDocument()
})
