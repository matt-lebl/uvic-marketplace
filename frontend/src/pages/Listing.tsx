import * as React from 'react'
import './App.css'
import { Box, Paper, Typography, Card } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'

function Listing() {
  return (
    <div className="Listing-View">
      <header className="App-header">
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '95%',
          marginTop: 3
        }}>
          <Paper sx={{ padding: '10px' }}>
            <PhotoGallery />
          </Paper>
          <Paper sx={{ width: '600px', ml: '80px' }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Card>
                <Typography>Listing Name</Typography>
              </Card>
              <Card>
                <Typography>Map</Typography>
              </Card>
              <Card>
                <Typography>Seller info</Typography>
              </Card>
            </Box>
          </Paper>
        </Box>
      </header>
    </div>
  )
}

export default Listing
