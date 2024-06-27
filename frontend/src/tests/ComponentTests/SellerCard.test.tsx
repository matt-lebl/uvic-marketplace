import React from 'react'
import { render, screen } from '@testing-library/react'
import SellerCard from '../../pages/Components/SellerCard'

test('renders seller card', () => {
  const { container } = render(<SellerCard />)

  expect(container.firstChild).toHaveClass('Seller-Card')
})
