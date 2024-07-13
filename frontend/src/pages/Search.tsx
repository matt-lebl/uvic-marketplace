import React from 'react'
import './App.css'
import { Typography, Box } from '@mui/material'
import RecommendedListings from './Components/RecommendedListings'
import { WidthFull } from '@mui/icons-material'
import { SearchRequest, ListingSummary, SearchResultsResponse } from '../interfaces'
import SearchListings from './Components/SearchListings'
import { APIGet } from '../APIlink'



function Search() {

  const searchFunc = async (searchRequest: SearchRequest): Promise<{ totalItems: number, items: ListingSummary[] }> => {
    // Add your logic here
    const results = {
      totalItems: 0,
      items: [] as ListingSummary[]
    }
    const queryParams: [string, string | number][] = Object.entries(searchRequest).filter(([key, value]) => value !== undefined && value !== null) as [string, string | number][];
    try {
      const res = await APIGet<SearchResultsResponse>('/api/search', queryParams)
      results.totalItems = res.totalItems
      results.items = res.items
    } catch (e) {
      console.error(e)
    } finally {
      return results
    }
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
          <SearchListings onSearch={searchFunc} />
        </Box>
      </header>
    </div>
  )
}

export default Search
