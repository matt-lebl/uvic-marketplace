import React from 'react'
import { useState } from 'react'
import { Box, Typography, Grid, Pagination } from '@mui/material'
import ListingCard from './ListingCard'
import { ChangeEvent } from 'react'
import { ListingSummary } from '../../interfaces'

interface Props {
  Listings: ListingSummary[]
}

const SearchListings: React.FC<Props> = ({Listings}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Calculate the current listings to display
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentListings = Listings.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  // Change page handler
  const handleChangePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage)
  }

  // Calculate total pages
  const totalPages = Math.ceil(Listings.length / itemsPerPage)

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
        Listings Found
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
        <Grid border={'white'} bgcolor={'transparent'} width={'100%'}>
          {currentListings.map((listing, index) => (
            <Grid item sx={{ width: '100%' }} key={index}>
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

export default SearchListings;