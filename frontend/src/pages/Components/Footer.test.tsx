import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

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

  it('has correct styles for footer elements', () => {
    render(<Footer />)
    const footerTitle = screen.getByText('UVic Marketplace')
    const footerMessage = screen.getByText(
      'Connecting the UVic community through shared goods and services.'
    )

    expect(footerTitle).toHaveStyle('text-align: center')
    expect(footerMessage).toHaveStyle('text-align: center')
  })
})
