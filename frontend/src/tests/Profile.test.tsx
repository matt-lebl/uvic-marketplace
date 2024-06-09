import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from '../pages/Profile';

// Jest test suite for frontend
// Invoke with `yarn test` or `npm test`

test('renders profile page', () => {
  render(<Profile />);
  const linkElement = screen.getByText(/Profile Page/i);
  expect(linkElement).toBeInTheDocument();
});
