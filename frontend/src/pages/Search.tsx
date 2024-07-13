import './App.css'
import { Box } from '@mui/material'
import { SearchRequest, ListingSummary, SearchResultsResponse } from '../interfaces'
import SearchListings from './Components/SearchListings'
import { APIGet } from '../APIlink'



function Search() {

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

    // Mock Data
    const mockListings: ListingSummary[] = [
      {
        listingID: 'listing-1',
        sellerID: 'seller-1',
        sellerName: 'Seller One',
        title: 'Listing Title 1',
        description: 'Description for listing 1',
        price: 100,
        dateCreated: '2024-01-01',
        imageUrl: 'https://example.com/image1.jpg',
      },
      {
        listingID: 'listing-2',
        sellerID: 'seller-2',
        sellerName: 'Seller Two',
        title: 'Listing Title 2',
        description: 'Description for listing 2',
        price: 200,
        dateCreated: '2024-01-02',
        imageUrl: 'https://example.com/image2.jpg',
      },
      {
        listingID: 'listing-3',
        sellerID: 'seller-3',
        sellerName: 'Seller Three',
        title: 'Listing Title 3',
        description: 'Description for listing 3',
        price: 300,
        dateCreated: '2024-01-03',
        imageUrl: 'https://example.com/image3.jpg',
      },
      {
        listingID: 'listing-4',
        sellerID: 'seller-4',
        sellerName: 'Seller Four',
        title: 'Listing Title 4',
        description: 'Description for listing 4',
        price: 400,
        dateCreated: '2024-01-04',
        imageUrl: 'https://example.com/image4.jpg',
      },
      {
        listingID: 'listing-5',
        sellerID: 'seller-5',
        sellerName: 'Seller Five',
        title: 'Listing Title 5',
        description: 'Description for listing 5',
        price: 500,
        dateCreated: '2024-01-05',
        imageUrl: 'https://example.com/image5.jpg',
      },
    ];
    return { totalItems: mockListings.length, items: mockListings };
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
