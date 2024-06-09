import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../pages/Components/Header';

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders listing page', () => {
  render(<Header />);
  const linkElement = screen.getByText(/Header/i);
  expect(linkElement).toBeInTheDocument();
});
