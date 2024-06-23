import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import ListingCard from './ListingCard'

// TODO: Implement hooks for fetching recommended listings, and dynamically render them
export default function RecommendedListings() {
  return (
    <Box>
        <Typography variant="h4">Recommended Listings</Typography>
        <Grid container spacing={4}>
            <Grid item xs={3}>
            <ListingCard />
            </Grid>
            <Grid item xs={3}>
            <ListingCard />
            </Grid>
            <Grid item xs={3}>
            <ListingCard />
            </Grid>
            <Grid item xs={3}>
            <ListingCard />
            </Grid>
        </Grid>
    </Box>
  )
}