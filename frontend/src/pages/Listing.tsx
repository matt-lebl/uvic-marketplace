import React from 'react'
import './App.css'
import { Typography, Box, Paper } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import ProfileIcon from './Components/ProfileIcon'
import SellerCard from './Components/SellerCard'
import { useParams } from 'react-router-dom'

function Listing() {

  let {listingID} = useParams();

  return (
    <div className="Listing">
      <header className="App-header">
        <Box sx={{ display: 'flex', flexDirection: 'row', }}>
          <Paper sx={{
            padding: '20px 20px 20px 20px',
            height: '85vh',
            backgroundColor: '#ffffff'
          }}>
            <Typography sx={{fontWeight:'700', }}>Photo Gallery{listingID}</Typography>
            <PhotoGallery />
          </Paper>
          <Paper sx={{
            minWidth: '40vw',
            hieght: 200,
            ml: 5,
            backgroundColor: '#656565',
            height: '85vh',
            overflow: 'auto'
          }}>
            <SellerCard />
          </Paper>
        </Box>
      </header>
    </div>
  )
}

export default Listing
