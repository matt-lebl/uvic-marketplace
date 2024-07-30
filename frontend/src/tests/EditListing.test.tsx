import React from 'react'
import { render } from '@testing-library/react'
import EditListing from '../pages/EditListing'
import { MemoryRouter } from 'react-router-dom'

test('renders edit-listing page', () => {
  const { container } = render(<MemoryRouter><EditListing /></MemoryRouter>)

  expect(container.firstChild).toHaveClass('Create-Listing')
})

test('renders photogallery', () => {
  const { container } = render(<MemoryRouter><EditListing /></MemoryRouter>)

  expect(container.getElementsByClassName('Photo-Previews').length).toBe(1)
})
