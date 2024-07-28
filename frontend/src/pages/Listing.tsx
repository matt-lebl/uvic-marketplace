import React, { useState, useEffect } from 'react'
import './App.css'
import { Typography, Box, Paper } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import SellerCard from './Components/SellerCard'
import { useNavigate, useParams } from 'react-router-dom'
import { APIGet } from '../APIlink'
import { ListingEntity } from '../interfaces'

interface ListingProps {
  listingData?: ListingEntity
}

const Listing: React.FC<ListingProps> = ({ listingData: initialListingData }) => {
  const navigate = useNavigate()
  const { listingID } = useParams()
  const [listingData, setListingData] = useState<ListingEntity | undefined>(initialListingData)
  const [loading, setLoading] = useState(!initialListingData)

  useEffect(() => {
    setTimeout(async () => {
      if (!listingID || initialListingData) return

      const listingURL: string = `/api/listing/${listingID}`

      await APIGet<ListingEntity>(listingURL)
        .catch((error) => {
          debugger;
          console.error('Failed to fetch current listing')
          navigate('/error')
        })
        .then((response) => {
          if (response) {
            setListingData(response)
          }
        })
        .finally(() => setLoading(false))
    }, 1000);
  }, [listingID, initialListingData])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!listingData) {
    return <div>Listing not found</div>
  }

  return (
    <div className="Listing">
      <header className="App-header">
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Paper
            sx={{
              padding: '20px',
              height: '85vh',
              backgroundColor: '#ffffff',
            }}
          >
            <Typography sx={{ fontWeight: '700' }}>Photo Gallery</Typography>
            <PhotoGallery images={listingData.images} />
          </Paper>
          <Paper
            sx={{
              minWidth: '40vw',
              ml: 5,
              backgroundColor: '#656565',
              height: '85vh',
              overflow: 'auto',
            }}
          >
            <SellerCard data={listingData} />
          </Paper>
        </Box>
      </header>
      <Box sx={{ mt: 2, ml: 2 }}>
        <Typography variant="h4">{listingData.title}</Typography>
        <Typography variant="body1">{listingData.description}</Typography>
        <Typography variant="h6">${listingData.price}</Typography>
      </Box>
    </div>
  )
}

export default Listing
