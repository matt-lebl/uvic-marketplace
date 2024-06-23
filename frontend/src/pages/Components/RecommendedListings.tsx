import React from 'react'
import { useState } from 'react'
import { Box, Typography, Grid, Pagination } from '@mui/material'
import ListingCard from './ListingCard'
import { ChangeEvent } from 'react'

// Define an interface for the listing structure
interface Listing {
    title: string
    description: string
    price: string
  }
  
  // Mock list of recommended listings with explicit type
  const recommendedListings: Listing[] = [];
  
  for (let i = 1; i <= 25; i++) {
    recommendedListings.push({
      title: `Listing ${i}`,
      description: `This is ${i === 1 ? 'a' : 'yet another'} recommended listing`,
      price: `$${i * 100}`
    })
  }

// TODO: Implement hooks for fetching recommended listings, and dynamically render them
export default function RecommendedListings() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5
  
    // Calculate the current listings to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentListings = recommendedListings.slice(indexOfFirstItem, indexOfLastItem);
  
    // Change page handler
    const handleChangePage = (event: ChangeEvent<unknown>, newPage: number) => {
      setCurrentPage(newPage)
    };
  
    // Calculate total pages
    const totalPages = Math.ceil(recommendedListings.length / itemsPerPage);
  
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        width: '100%',
        paddingX: 2,
        paddingBottom: 3,
      }}>
        <Typography variant="h4" alignSelf={"flex-start"}>Recommended Listings</Typography>
        <Box sx={{
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
        }}>
          <Grid border={"white"} bgcolor={"transparent"} width={"100%"}>
            {currentListings.map((listing, index) => (
              <Grid item sx={{width: "100%"}} key={index}>
                <ListingCard {...listing} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          sx={{ marginTop: 2 }}
        />
      </Box>
    )
  }