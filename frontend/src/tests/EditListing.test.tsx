import React from 'react'
import { render } from '@testing-library/react'
import EditListing from '../pages/EditListing'

test('renders edit-listing page', () => {
  const { container } = render(<EditListing />)

  expect(container.firstChild).toHaveClass('Create-Listing')
})

test('renders photogallery', () => {
  const { container } = render(<EditListing />)

  expect(container.getElementsByClassName('Photo-Previews').length).toBe(1)
})
