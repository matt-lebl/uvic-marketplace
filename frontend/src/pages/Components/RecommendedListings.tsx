import React from 'react'
import { useState } from 'react'
import { Box, Typography, Grid, Pagination, Button } from '@mui/material'
import ListingCard from './ListingCard'
import { ChangeEvent } from 'react'
import { ListingSummary } from '../../interfaces'
import { APIGet } from '../../APIlink'

let recommendedListings: ListingSummary[] = [
  // {
  //   listingID: '1',
  //   title: 'Test Listing',
  //   description: 'This is a test listing',
  //   sellerID: '1',
  //   sellerName: 'Test Seller',
  //   charityID: '1',
  //   price: 10,
  //   dateCreated: '2021-10-10',
  //   imageUrl: 'https://via.placeholder.com/150',
  // },
  // {
  //   listingID: '2',
  //   title: 'Test Listing 2',
  //   description: 'This is a test listing 2',
  //   sellerID: '2',
  //   sellerName: 'Test Seller 2',
  //   charityID: '2',
  //   price: 20,
  //   dateCreated: '2021-10-11',
  //   imageUrl: 'https://via.placeholder.com/150',
  // },
  // {
  //   listingID: '3',
  //   title: 'Test Listing 3',
  //   description: 'This is a test listing 3',
  //   sellerID: '3',
  //   sellerName: 'Test Seller 3',
  //   charityID: '3',
  //   price: 30,
  //   dateCreated: '2021-10-12',
  //   imageUrl: 'https://via.placeholder.com/150',
  // }
]

const retrieveRecommendedListings = async () => {
  try {
    const response: undefined | ListingSummary[] = await APIGet(
      '/api/recommendations'
    )
    if (response) {
      recommendedListings = response
    }
  } catch (error) {
    console.error('Error fetching recommended listings:', error)
  }
}

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
  retrieveRecommendedListings()

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
