import React from 'react'
import { render } from '@testing-library/react'
import PhotoGallery from '../../pages/Components/PhotoGallery'

const itemData = [
  {
    url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
  },
  {
    url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  },
  {
    url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
  },
  {
    url: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
  },
  {
    url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
  },
  {
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  },
  {
    url: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
  },
  {
    url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
  },
  {
    url: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
  },
  {
    url: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
  },
  {
    url: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
  },
  {
    url: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
  },
]

test('renders photo gallery', () => {
  const { container } = render(<PhotoGallery images={itemData} />)

  expect(container.firstChild).toHaveClass('Photo-Gallery')
})
