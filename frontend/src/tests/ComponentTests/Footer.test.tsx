import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '../../pages/Components/Footer'

describe('Footer', () => {
  it('renders the footer with title', () => {
    render(<Footer />)
    expect(screen.getByText('UVic Marketplace')).toBeInTheDocument()
  })

  it('renders the footer with the message', () => {
    render(<Footer />)
    expect(
      screen.getByText(
        'Connecting the UVic community through shared goods and services.'
      )
    ).toBeInTheDocument()
  })
})
