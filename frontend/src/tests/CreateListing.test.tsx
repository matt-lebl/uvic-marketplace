import React from 'react'
import { render } from '@testing-library/react'
import CreateListing from '../pages/CreateListing'


test('renders new-listing page', () => {
  const { container }= render(<CreateListing />)
  
  expect(container.firstChild).toHaveClass('Create-Listing')
})

test('renders photogallery', () => {
  const { container }= render(<CreateListing />)
  
  expect(container.getElementsByClassName('Photo-Previews').length).toBe(1)
})

