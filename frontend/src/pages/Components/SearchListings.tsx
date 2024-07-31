import React, { useContext, useRef } from 'react'
import { useEffect, useState } from 'react'
import { Box, Typography, Grid, Pagination } from '@mui/material'
import ListingCard from './ListingCard'
import { ChangeEvent } from 'react'
import { ListingSummary, SearchRequest, Sort } from '../../interfaces'
import { AddData, DataContext } from '../../DataContext'
import SelectInput from './SelectInput'

const BASESEARCHLIMIT: number = parseInt(
  process.env.REACT_APP_DEFAULT_BULK_RETURN_LIMIT ?? '20'
) // ?? "0" only exists to prevent type errors. It should never be reached.
const LISTINGLIMITPERPAGE: string[] = [
  '1',
  '10',
  BASESEARCHLIMIT.toString(),
  '50',
]

interface props {
  onSearch: (
    searchRequest: SearchRequest
  ) => Promise<{ totalItems: number; items: ListingSummary[] }>
  searchRequest: SearchRequest
}

const SearchListings: React.FC<props> = ({ onSearch, searchRequest }) => {
  const context = useContext(DataContext)
  const searchRequestID = 'searchRequest'
  const [listings, setListings] = useState<ListingSummary[]>(
    [] as ListingSummary[]
  )
  const [totalListingsCount, setTotalListingsCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(
    searchRequest.page ?? 1
  )
  const [itemsPerPage, setItemsPerPage] = useState<string>(
    searchRequest.limit?.toString() ?? BASESEARCHLIMIT.toString()
  )
  const [totalPages, setTotalPages] = useState<number>(1)
  const [sorting, setSorting] = useState<Sort>(
    searchRequest.sort ?? Sort.RELEVANCE
  )
  const [loading, setLoading] = useState(true)

  const ref = useRef(1)

  const doSearch = () => {
    setTimeout(async () => {
      let res = await onSearch(searchRequest)
      setListings(res?.items ?? ([] as ListingSummary[]))
      setTotalListingsCount(res?.totalItems ?? 0)
      setTotalPages(Math.ceil((res?.totalItems ?? 0) / parseInt(itemsPerPage)))
    }, 1000)
    ref.current -= 1
    setLoading(false)
  }

  //changing amount of listings to display
  const handleChangeListingLimit = (newLimit: string | undefined) => {
    if (newLimit !== undefined) {
      setLoading(true)
      const newPage = Math.max(
        1,
        Math.floor(
          ((currentPage - 1) *
            Math.min(parseInt(itemsPerPage), totalListingsCount)) /
          parseInt(newLimit)
        )
      )
      setItemsPerPage(newLimit)
      searchRequest.limit = parseInt(newLimit)
      handleChangePage(undefined, newPage)
    }
  }

  // Change page handler
  const handleChangePage = (
    event: ChangeEvent<unknown> | undefined,
    newPage: number
  ) => {
    setLoading(true)
    ref.current += 1
    setCurrentPage(newPage)
    searchRequest.page = newPage
    AddData(context, searchRequestID, searchRequest)
  }

  //Changing sorting
  const handleChangeSorting = (sort: string | undefined) => {
    if (sort !== undefined && sort in Sort) {
      setLoading(true)
      ref.current += 1
      var enumSort = sort as Sort
      setSorting(enumSort)
      searchRequest.sort = enumSort
      searchRequest.page = 1
      AddData(context, searchRequestID, searchRequest)
    }
  }

  //should trigger only the first time the component is rendered, and then whenever the search request is altered. Need to do it this weird complicated way, as other wise it won't detect changes made by searching when on the search page, as the search request won't update on rerender.
  useEffect(() => {
    ref.current += 1
    doSearch()
  }, [searchRequest])

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
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          width: '100%',
          paddingX: 2,
          paddingBottom: 3,
        }}
      >
        <SelectInput
          label="Sort"
          defaultVal={sorting}
          onChange={handleChangeSorting}
          options={Object.values(Sort)}
        />
        <SelectInput
          label="Results Per Page"
          defaultVal={itemsPerPage}
          onChange={handleChangeListingLimit}
          options={LISTINGLIMITPERPAGE}
        />
      </Box>
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
        {loading ? (
          <div>Loading...</div>
        ) : totalListingsCount === 0 ? (
          <Typography variant="h6" align="center" mt={3}>
            Nothing found here, check back later!
          </Typography>
        ) : (
          <Grid border={'white'} bgcolor={'transparent'} width={'100%'}>
            {listings.map((listing, index) => (
              <Grid item sx={{ width: '100%' }} key={index}>
                <ListingCard {...listing} />
              </Grid>
            ))}
          </Grid>
        )}
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

export default SearchListings
