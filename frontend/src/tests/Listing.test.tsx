import React from 'react'
import { render } from '@testing-library/react'
import Listing from '../pages/Listing'

test('renders listing page', () => {
  const { container } = render(<Listing />)

  expect(container.firstChild).toHaveClass('Listing')
})

test('renders photogallery', () => {
  const { container } = render(<Listing />)

  expect(container.getElementsByClassName('Photo-Gallery').length).toBe(1)
})

test('renders seller card', () => {
  const { container } = render(<Listing />)

  expect(container.getElementsByClassName('Seller-Card').length).toBe(1)
})
