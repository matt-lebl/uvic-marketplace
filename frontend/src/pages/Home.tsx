import React from 'react'
import './App.css'
import { Typography, Box } from '@mui/material'
import RecommendedListings from './Components/RecommendedListings'
import { WidthFull } from '@mui/icons-material'

function Home() {
  return (
    <div className="Home">
      <header className="App-header">
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          alignItems: 'center',
          marginTop: 3,
          width: '90%'
        }}>
          <RecommendedListings />
        </Box>
      </header>
    </div>
  )
}

export default Home
