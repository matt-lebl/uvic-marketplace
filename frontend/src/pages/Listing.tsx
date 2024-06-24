import React from 'react'
import './App.css'
import { Typography, Box, Paper } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import ProfileIcon from './Components/ProfileIcon'
import SellerCard from './Components/SellerCard'

function Listing() {
  return (
    <div className="Listing">
      <header className="App-header">
        <Box sx={{ display: 'flex', flexDirection: 'row', }}>
          <Paper sx={{
            padding: '30px',
            maxHeight: '85vh',
            backgroundColor: '#ffffff'
          }}>
            <PhotoGallery />
          </Paper>
          <Paper sx={{
            minWidth: 700,
            hieght: 200,
            ml: 5,
            backgroundColor: '#656565',
            maxHeight: '85vh',
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
