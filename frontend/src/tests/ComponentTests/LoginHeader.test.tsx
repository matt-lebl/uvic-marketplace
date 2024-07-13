import React from 'react'
import { render, screen } from '@testing-library/react'
import LoginHeader from '../../pages/Components/LoginHeader'
import { MemoryRouter } from 'react-router-dom'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders listing page', () => {
  render(
    <MemoryRouter>
      <LoginHeader />
    </MemoryRouter>
  )
  const linkElement = screen.getByText(/UVic Marketplace/i)
  expect(linkElement).toBeInTheDocument()
})
