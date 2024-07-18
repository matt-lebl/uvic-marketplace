import * as React from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'

interface PhotoGalleryProps {
  images: { url: string }[]
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images }) => {
  return (
    <div className="Photo-Gallery">
      <ImageList
        sx={{ width: '50vw', height: '75vh', border: '1px solid' }}
        cols={1}
      >
        {images.map((image, index) => (
          <ImageListItem key={index}>
            <img
              srcSet={`${image.url}`}
              src={`${image.url}?w=164&h=164&fit=crop&auto=format`}
              alt={`Image ${index}`}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  )
}

export default PhotoGallery
