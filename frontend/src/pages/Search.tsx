import React from 'react'
import './App.css'
import { Typography, Box } from '@mui/material'
import RecommendedListings from './Components/RecommendedListings'
import { WidthFull } from '@mui/icons-material'
import { SearchRequest, ListingSummary } from '../interfaces'
import SearchListings from './Components/SearchListings'

function Search() {
  return (
    <div className="Home">
      <header className="App-header">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            alignItems: 'center',
            marginTop: 3,
            width: '90%',
          }}
        >
          <SearchListings />
        </Box>
      </header>
    </div>
  )
}

export default Search
