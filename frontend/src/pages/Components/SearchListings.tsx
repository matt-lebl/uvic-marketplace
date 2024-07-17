import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { Box, Typography, Grid, Pagination } from '@mui/material'
import ListingCard from './ListingCard'
import { ChangeEvent } from 'react'
import { ListingSummary, SearchRequest, Sort } from '../../interfaces'
import { AddData, DataContext, GetData } from '../../DataContext'
import SelectInput from './SelectInput'

const BASESEARCHLIMIT: number = parseInt(process.env.REACT_APP_DEFAULT_BULK_RETURN_LIMIT ?? "0"); // ?? "0" only exists to prevent type errors. It should never be reached.

interface props {
  onSearch: (searchRequest: SearchRequest) => Promise<{ totalItems: number, items: ListingSummary[] }>;
}

const SearchListings: React.FC<props> = ({ onSearch }) => {
  const searchRequestID = "searchRequest"
  const context = useContext(DataContext);

  const blankSearchRequest: SearchRequest = {
    query: '',
    minPrice: undefined,
    maxPrice: undefined,
    status: undefined,
    searchType: undefined,
    latitude: 0,
    longitude: 0,
    sort: Sort.RELEVANCE,
    page: 1,
    limit: BASESEARCHLIMIT,
  }


  const [searchRequest, setSearchRequest] = useState<SearchRequest>(GetData(context, searchRequestID) ?? blankSearchRequest)
  const [currentPage, setCurrentPage] = useState<number>(searchRequest.page ?? 1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(searchRequest.limit ?? BASESEARCHLIMIT);
  const [listings, setListings] = useState<ListingSummary[]>([] as ListingSummary[])
  const [totalListingsCount, setTotalListingsCount] = useState<number>(0)
  const [sorting, setSorting] = useState<Sort>(searchRequest.sort ?? Sort.RELEVANCE)


  const doSearch = async () => {
    let res = await onSearch(searchRequest)
    setListings(res?.items ?? [] as ListingSummary[])
    setTotalListingsCount(res?.totalItems ?? 0)
  }

  setTimeout(async () => { doSearch() }, 1000);

  // Calculate the current listings to display


  // Change page handler
  const handleChangePage = (event: ChangeEvent<unknown>, newPage: number) => {
    console.log(newPage)
    setCurrentPage(newPage)
    searchRequest.page = newPage
    setSearchRequest(searchRequest)
    AddData(context, searchRequestID, searchRequest)
    setTimeout(async () => {
      await doSearch()
    }, 1000)
  }

  const handleChangeSorting = (sort: string | undefined) => {
    if (sort !== undefined && sort in Sort) {
      var enumSort = sort as Sort;
      setSorting(enumSort)
      searchRequest.sort = enumSort
      searchRequest.page = 1;
      setSearchRequest(searchRequest)
      AddData(context, searchRequestID, searchRequest)
      setTimeout(async () => {
        await doSearch()
      }, 1000)
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalListingsCount / itemsPerPage)

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
      <SelectInput label='Sort' defaultVal={sorting} onChange={handleChangeSorting} options={Object.values(Sort)} />
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
          {listings.map((listing, index) => (
            <Grid item sx={{ width: '100%' }} key={index}>
              <ListingCard {...listing} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Pagination
        test-id="pagination"
        count={totalPages}
        page={currentPage}
        onChange={handleChangePage}
        sx={{ marginTop: 2 }}
      />
    </Box>
  )
}

export default SearchListings;