import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginHeader from './LoginHeader';

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders listing page', () => {
  render(<LoginHeader />);
  const linkElement = screen.getByText(/Login Header/i);
  expect(linkElement).toBeInTheDocument();
});
