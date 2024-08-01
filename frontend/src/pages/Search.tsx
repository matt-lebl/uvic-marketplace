import './App.css'
import { Box } from '@mui/material'
import {
  SearchRequest,
  ListingSummary,
  SearchResultsResponse,
  Sort,
} from '../interfaces'
import SearchListings from './Components/SearchListings'
import { APIGet } from '../APIlink'
import { AddData, DataContext, GetData } from '../DataContext'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BASESEARCHLIMIT: number = parseInt(
  process.env.REACT_APP_DEFAULT_BULK_RETURN_LIMIT ?? '20'
) // ?? "0" only exists to prevent type errors. It should never be reached.

function Search() {
  const navigate = useNavigate()

  const context = useContext(DataContext)
  const searchRequestID = 'searchRequest'
  const [searchRequest, setSearchRequest] = useState<SearchRequest>(GetData(context, searchRequestID) ?? {
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
  } as SearchRequest)

  useEffect(() => {
    const storedSearchRequest = GetData(context, searchRequestID)
    if (storedSearchRequest === null) {
      AddData(context, searchRequestID, searchRequest)
    } else if (
      Object.entries(storedSearchRequest).join(',') !==
      Object.entries(searchRequest).join(',')
    ) {
      setSearchRequest(storedSearchRequest)
    }
  }, [context, searchRequest, searchRequestID])

  const searchFunc = async (
    searchRequest: SearchRequest
  ): Promise<{ totalItems: number; items: ListingSummary[] }> => {
    var results = {
      totalItems: 0,
      items: [] as ListingSummary[],
    }
    const queryParams: [string, string | number][] = Object.entries(
      searchRequest
    ).filter(([key, value]) => value !== undefined && value !== null) as [
      string,
      string | number,
    ][]
    try {
      var response = await APIGet<SearchResultsResponse>('/api/search', queryParams)
      if (response) {
        results.totalItems = response.totalItems
        results.items = response.items
      }
    } catch (error) {
      debugger;
      console.error("Could not get Search Results")
      navigate('/error')
    }
    return results;
  }

  return (
    <div className="Home">
      <header className="App-header">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            alignItems: 'center',
            marginTop: 3,
            width: '90%',
          }}
        >
          <SearchListings onSearch={searchFunc} searchRequest={searchRequest} />
        </Box>
      </header>
    </div>
  )
}

export default Search
