import React, { useState, useEffect } from 'react'
import './App.css'
import { Typography, Box, Paper } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import SellerCard from './Components/SellerCard'
import { useParams } from 'react-router-dom'
import { APIGet } from '../APIlink'
import { ListingEntity } from '../interfaces'

interface ListingProps {
  listingData?: ListingEntity
}

const Listing: React.FC<ListingProps> = ({
  listingData: initialListingData,
}) => {
  const { listingID } = useParams()
  const [listingData, setListingData] = useState<ListingEntity | undefined>(
    initialListingData
  )
  const [loading, setLoading] = useState(!initialListingData)

  useEffect(() => {
    async function fetchListing() {
      if (!listingID || initialListingData) return

      const listingURL: string = `/api/listing/${listingID}`

      try {
        const response = (await APIGet(listingURL)) as ListingEntity
        if (response) {
          setListingData(response)
        }
      } catch (error) {
        console.log('Request Error', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
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
