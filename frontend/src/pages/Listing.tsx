import React from 'react'
import './App.css'
import { Typography, Box, Paper } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import ProfileIcon from './Components/ProfileIcon'

function Listing() {
  return (
    <div className="Listing">
      <header className="App-header">
        <Box sx={{ display: 'flex', flexDirection: 'row',  }}>
          <Paper className='Photo-Gallery' sx={{ 
            padding: '20px', 
            maxHeight: '85vh', 
            backgroundColor: '#ffffff' 
            }}>
            <PhotoGallery />
          </Paper>
          <Paper className='Seller-Info' sx={{
            minWidth: 600,
            hieght: 200,
            ml: 10,
            backgroundColor: '#656565',
            maxHeight:'85vh',
            overflow:'auto'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', padding: '50px', flexGrow: 1}}>
              <ProfileIcon id='listing-pfp' name='listing-pfp' imageSrc='../tests/Test_Resources/TestProfileImage.jpg' />
              <Paper sx={{ flexGrow: 1, ml: '30px' }}>
                <Typography sx={{ m: '30px' }}>Contact Information</Typography>
                <Typography sx={{ m: '30px' }}>Payment Preference</Typography>
              </Paper>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'cloumn' }}></Box>
            <Paper sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: '80px', m: '0 50px 10px 50px' }}>
              <Typography>Map Placeholder</Typography>
            </Paper>
            <Paper sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: '20px', m: '10px 50px 10px 50px' }}>
              <Typography sx={{ fontWeight: 800 }}>Listing Title</Typography>
            </Paper>
            <Paper sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: '20px', m: '10px 50px 10px 50px' }}>
              <Typography>Status, Date Created...</Typography>
            </Paper>
            <Paper sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: '80px 0 200px 20px', m: '0 50px 10px 50px' }}>
              <Typography>Listing Description</Typography>
            </Paper>
          </Paper>
        </Box>
      </header>
    </div>
  )
}

export default Listing
