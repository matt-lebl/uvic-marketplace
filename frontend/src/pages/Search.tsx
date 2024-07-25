import './App.css'
import { Box } from '@mui/material'
import { SearchRequest, ListingSummary, SearchResultsResponse, Sort } from '../interfaces'
import SearchListings from './Components/SearchListings'
import { APIGet } from '../APIlink'
import { DataContext, GetData } from '../DataContext'
import { useContext, useEffect, useState } from 'react'

const BASESEARCHLIMIT: number = parseInt(process.env.REACT_APP_DEFAULT_BULK_RETURN_LIMIT ?? "20"); // ?? "0" only exists to prevent type errors. It should never be reached.

function Search() {
  const searchRequestID = "searchRequest"
  console.log("Search Page");
  const context = useContext(DataContext);

  const [listings, setListings] = useState<ListingSummary[]>([] as ListingSummary[])
  const [totalListingsCount, setTotalListingsCount] = useState<number>(0)


  const searchFunc = async (searchRequest: SearchRequest): Promise<{ totalItems: number, items: ListingSummary[] }> => {
    // Add your logic here
    var results = {
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
    }
    finally { return results }

  }
  useEffect(() => {
    setTimeout(async () => {
      console.log("searchRequest")

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

      const res = await searchFunc(GetData(context, searchRequestID) ?? blankSearchRequest);
      setListings(res?.items ?? [] as ListingSummary[])
      setTotalListingsCount(res?.totalItems ?? 0)
    }, 1000);
  });

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
          <SearchListings initalItems={listings} initialTotalItems={totalListingsCount} onSearch={searchFunc} />
        </Box>
      </header>
    </div>
  )
}

export default Search
