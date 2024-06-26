import React from 'react'
import { Box, Typography } from '@mui/material'

export default function ListingCard(listing: any) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginTop: 3,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid black',
          background: 'white',
          borderRadius: '10px',
          boxShadow: 2,
          width: '100%',
          padding: 2,
        }}
      >
        <Box>
          <Typography variant="h6" alignSelf={'flex-start'}>
            {listing.title}
          </Typography>
          <Typography variant="body1" alignSelf={'flex-start'}>
            {listing.description}
          </Typography>
          <Typography variant="h6" alignSelf={'flex-start'}>
            {listing.price}
          </Typography>
           <Button
            variant="text"
            onClick={() => navigate('/listing')}
            color="inherit"
            sx={{ mr: '40px' }}
          >
            View Listing
          </Button>
        </Box>
        <Box>
          <img src="https://via.placeholder.com/150" alt="placeholder" />
        </Box>
      </Box>
    </Box>
  )
}
