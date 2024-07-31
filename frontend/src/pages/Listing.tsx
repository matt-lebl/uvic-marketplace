import React, { useState, useEffect } from 'react'
import './App.css'
import { Typography, Box, Paper, Button } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import SellerCard from './Components/SellerCard'
import { APIGet } from '../APIlink'
import { ListingEntity } from '../interfaces'
import { useParams, useNavigate } from 'react-router-dom'

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
  const [userListing, setUserListing] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchListing() {
      if (!listingID || initialListingData) return

      const listingURL: string = `/api/listing/${listingID}`

      try {
        const response = (await APIGet(listingURL)) as ListingEntity
        if (response) {
          setListingData(response)
          checkUserListing(response)
        }
      } catch (error) {
        console.log('Request Error', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [listingID, initialListingData])

  const checkUserListing = (listing: ListingEntity) => {
    const userID = localStorage.getItem('userID')
    if (userID === listing.seller_profile.userID) {
      setUserListing(true)
    } else {
      setUserListing(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!listingData) {
    return <div>Listing not found</div>
  }

  return (
    <div className="Listing">
      <header className="App-header">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            alignItems: 'center',
            marginTop: 1,
            width: '90%',
          }}
        >
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
              }}
              component="form"
              onSubmit={(e) => {
                e.preventDefault()
                if (userListing) {
                  navigate(`/edit-listing/${listingID}`)
                }
              }}
            >
              <Box>
                <SellerCard data={listingData} />
              </Box>
              {userListing && (
                <Box display={'flex'} flexDirection={'row-reverse'}>
                  <Button variant="contained" type="submit">
                    Edit
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </header>
    </div>
  )
}

export default Listing
