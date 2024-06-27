import React from 'react'
import { render, screen } from '@testing-library/react'
import PhotoGallery from '../../pages/Components/PhotoGallery'

test('renders photo gallery', () => {
  const { container } = render(<PhotoGallery />)

  expect(container.firstChild).toHaveClass('Photo-Gallery')
})
