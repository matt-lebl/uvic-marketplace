import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ListingCard() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignItems: 'center',
      marginTop: 3,
      width: '90%'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        border: '1px solid black',
        borderRadius: '10px',
        width: '100%',
        padding: 2
      }}>
        <Typography variant="h6">Listing Picture</Typography>
        <Typography variant="body1">Listing Title</Typography>
        <Typography variant="body2">Listing Price</Typography>
      </Box>
    </Box>
  )
}