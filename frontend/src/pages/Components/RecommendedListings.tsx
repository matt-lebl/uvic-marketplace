import { useState, useEffect } from 'react'
import { Box, Typography, Grid, Pagination } from '@mui/material'
import ListingCard from './ListingCard'
import { ChangeEvent } from 'react'
import { ListingSummary } from '../../interfaces'
import { APIGet, APIPost } from '../../APIlink'
import SelectInput from './SelectInput'
import { useNavigate } from 'react-router-dom'


const BASESEARCHLIMIT: number = parseInt(process.env.REACT_APP_DEFAULT_BULK_RETURN_LIMIT ?? "20"); // ?? "0" only exists to prevent type errors. It should never be reached.
const LISTINGLIMITPERPAGE: string[] = ["1", "5", "10", BASESEARCHLIMIT.toString(), "50"]


// TODO: Implement hooks for fetching recommended listings, and dynamically render them
export default function RecommendedListings() {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<string>(BASESEARCHLIMIT.toString());
  const [recommendedListings, setRecommendedListings] = useState<ListingSummary[]>([])
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(100 / parseInt(itemsPerPage)))
  const [loading, setLoading] = useState(true)

  const getRecommendations = () => {
    setTimeout(async () => {
      await APIGet<ListingSummary[]>(`/api/recommendations`, [['page', currentPage], ['limit', itemsPerPage]])
        .catch((error) => {
          debugger;
          console.error('Failed to fetch recomendations')
          navigate('/error')
        })
        .then((data) => {
          if (data) {
            setRecommendedListings(data)
          }
        })
    }, 1000)
    setLoading(false)
  }

  const handleChangeListingLimit = (newLimit: string | undefined) => {
    if (newLimit !== undefined) {
      setLoading(true)
      const newPage = Math.max(1, Math.floor((currentPage - 1) * parseInt(itemsPerPage) / parseInt(newLimit)))
      setItemsPerPage(newLimit)
      setTotalPages(Math.ceil(100 / parseInt(newLimit)))
      handleChangePage(undefined, newPage)
    }
  }

  // Change page handler
  const handleChangePage = (event: ChangeEvent<unknown> | undefined, newPage: number) => {
    setLoading(true)
    setCurrentPage(newPage)
    getRecommendations()
  }

  // Fetch recommended listings
  useEffect(() => {
    getRecommendations()
  }, [])

  const handleRemoveRecommendation = async (listingID: string) => {
    // Remove the recommendation from the list
    await APIPost(`/api/recommendations/stop/${listingID}`)
      .catch((error) => {
        debugger;
        console.error('Failed to remove recommendation')
        navigate('/error')
      })
      .then((data) => {
        if (data) {
          setRecommendedListings(recommendedListings.filter((listing) => listing.listingID !== listingID))
        }
      })
  }

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
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          width: '100%',
          paddingX: 2,
          paddingBottom: 3,
        }}
      >
        <SelectInput label='Results Per Page' defaultVal={itemsPerPage} onChange={handleChangeListingLimit} options={LISTINGLIMITPERPAGE} />
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
        {recommendedListings.length === 0 ? (
          <Typography variant="h6" align="center" mt={3}>
            Nothing found here, check back later!
          </Typography>
        ) : loading ? (<Typography variant="h6" align="center" mt={3}>
          Loading
        </Typography>) : (
          <Grid border={'white'} bgcolor={'transparent'} width={'100%'}>
            {recommendedListings.map((listing, index) => (
              <Grid item sx={{ width: '100%' }} key={index}>
                <ListingCard {...listing} />
                <Typography
                  data-testid={`remove-recommendation-${listing.listingID}`}
                  variant="body2"
                  fontSize={13}
                  align="right"
                  mt={1}
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => handleRemoveRecommendation(listing.listingID)}
                >
                  Remove recommendation
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      {recommendedListings.length !== 0 ? (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          sx={{ marginTop: 2 }}
        />
      ) : null}
    </Box>
  )
}
