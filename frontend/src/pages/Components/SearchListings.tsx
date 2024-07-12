import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { Box, Typography, Grid, Pagination } from '@mui/material'
import ListingCard from './ListingCard'
import { ChangeEvent } from 'react'
import { ListingSummary, SearchRequest, SearchResultsResponse, Sort } from '../../interfaces'
import { AddData, DataContext, GetData } from '../../DataContext'
import { APIGet } from '../../APIlink'
import SelectInput from './SelectInput'

const BASESEARCHLIMIT: number = parseInt(process.env.REACT_APP_DEFAULT_BULK_RETURN_LIMIT ?? "0"); // ?? "0" only exists to prevent type errors. It should never be reached.

const SearchListings: React.FC = () => {
  const searchRequestID = "searchRequest"
  const context = useContext(DataContext);


  const [searchRequest, setSearchRequest] = useState<SearchRequest>(GetData(context, searchRequestID))
  const [currentPage, setCurrentPage] = useState<number>(searchRequest.page ?? 1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(searchRequest.limit ?? BASESEARCHLIMIT);
  const [listings, setListings] = useState<ListingSummary[]>([])
  const [totalListingsCount, setTotalListingsCount] = useState<number>(0)
  const [sorting, setSorting] = useState<Sort>(searchRequest.sort ?? Sort.RELEVANCE)

  // Calculate the current listings to display
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentListings = listings.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const doSearch = async () => {
    const queryParams: [string, string | number][] = Object.entries(searchRequest).filter(([key, value]) => value !== undefined && value !== null) as [string, string | number][];
    try {
      const res = await APIGet<SearchResultsResponse>('api/search', queryParams)
      setListings(res.items)
      setTotalListingsCount(res.totalItems)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => { doSearch() })

  // Change page handler
  const handleChangePage = async (event: ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage)
    searchRequest.page = newPage
    setSearchRequest(searchRequest)
    AddData(context, searchRequestID, searchRequest)
    await doSearch()
  }

  // const handleChangeSorting = async (sort: Sort) => {
  //   setSorting(sort)
  //   searchRequest.sort = sort
  //   setSearchRequest(searchRequest)
  //   AddData(searchRequestID, searchRequest)
  //   await doSearch()
  // }

  // Calculate total pages
  const totalPages = Math.ceil(totalListingsCount / itemsPerPage)
  //<SelectInput label='Sort' defaultVal={sorting} onChange={() => handleChangeSorting} options={Object.values(Sort)} />

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