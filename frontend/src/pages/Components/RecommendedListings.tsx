import React from 'react'
import { useState, useEffect } from 'react'
import { Box, Typography, Grid, Pagination, Button } from '@mui/material'
import ListingCard from './ListingCard'
import { ChangeEvent } from 'react'
import { ListingSummary } from '../../interfaces'
import { APIGet, APIPost } from '../../APIlink'

let recommendedListings: ListingSummary[] = []

// TODO: Implement hooks for fetching recommended listings, and dynamically render them
export default function RecommendedListings() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Calculate the current listings to display
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentListings = recommendedListings.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  // Change page handler
  const handleChangePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage)
  }

  // Calculate total pages
  const totalPages = Math.ceil(recommendedListings.length / itemsPerPage)

  // Fetch recommended listings
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await APIGet<ListingSummary[]>(
          `/api/recommendations`
        )
        if (res) {
          recommendedListings = res
        }
      } catch (error) {
        console.log('Error fetching recommended listings:', error)
      }
    }
    fetchRecommendations()
  }, [])

  const handleRemoveRecommendation = async (listingID: string) => {
    // Remove the recommendation from the list
    try {
      const response = await APIPost(`/api/recommendations/stop/${listingID}`, {})
      if (response) {
        window.location.reload()
      }
    } catch (error) {
      console.log('Error removing recommendation:', error)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        width: '100%',
        paddingX: 2,
        paddingBottom: 3,
      }}
    >
      <Typography variant="h4" alignSelf={'flex-start'}>
        Recommended Listings
      </Typography>
      <Box
        sx={{
          maxHeight: '800px',
          overflowY: 'scroll',
          width: '100%',
          marginTop: 5,
          border: '2px solid lightgray',
          borderRadius: '10px',
          background: '#B5DBFF',
          boxShadow: 7,
          paddingX: 2,
          paddingBottom: 3,
        }}
      >
        {recommendedListings.length === 0 ? (
        <Typography variant="h6" align="center" mt={3}>
          Nothing found here, check back later!
        </Typography>
        ) : (
        <Grid border={'white'} bgcolor={'transparent'} width={'100%'}>
          {currentListings.map((listing, index) => (
            <Grid item sx={{ width: '100%' }} key={index}>
              <ListingCard {...listing} />
              <Typography variant="body2" fontSize={13} align="right" mt={1} sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleRemoveRecommendation(listing.listingID)}>
                  Remove recommendation
              </Typography>
            </Grid>
          ))}
        </Grid>
        )}
      </Box>
      {recommendedListings.length != 0 ? 
        <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChangePage}
        sx={{ marginTop: 2 }}
        />
      : null}
    </Box>
  )
}
