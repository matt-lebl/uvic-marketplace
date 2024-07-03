import React from 'react'
import './App.css'
import { Typography, Box, Paper } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import SellerCard from './Components/SellerCard'
import { ListingEntity } from '../interfaces'
import { APIGet } from '../APIlink'

function Listing() {
  const listingID 

  const listing : ListingEntity = APIGet;

  return (
    <div className="Listing">
      <header className="App-header">
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Paper
            sx={{
              padding: '20px 20px 20px 20px',
              height: '85vh',
              backgroundColor: '#ffffff',
            }}
          >
            <Typography sx={{ fontWeight: '700' }}>Photo Gallery</Typography>
            <PhotoGallery />
          </Paper>
          <Paper
            sx={{
              minWidth: '40vw',
              hieght: 200,
              ml: 5,
              backgroundColor: '#656565',
              height: '85vh',
              overflow: 'auto',
            }}
          >
            <SellerCard listing={listing}/>
          </Paper>
        </Box>
      </header>
    </div>
  )
}

export default Listing
