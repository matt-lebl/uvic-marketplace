import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`
jest.mock('react-leaflet', () => jest.fn());
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))
test('renders recommended section', () => {
  // Test that the recommendation section is created
  render(<Home />)
  const recommended = screen.getByText(/Recommended Listings/i)
  expect(recommended).toBeInTheDocument()
})
