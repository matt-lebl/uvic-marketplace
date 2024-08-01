import React, { useState, useEffect } from 'react'
import './App.css'
import { Typography, Box, Paper, Button, TextField } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import SellerCard from './Components/SellerCard'
import { APIGet, APIPost } from '../APIlink'
import { ListingEntity, Message, NewMessage } from '../interfaces'
import { useParams, useNavigate } from 'react-router-dom'
import Reviews from './Components/Reviews'

interface ListingProps {
  listingData?: ListingEntity
}

const Listing: React.FC<ListingProps> = ({
  listingData: initialListingData,
}) => {
  const { listingID } = useParams<string>()
  const [listingData, setListingData] = useState<ListingEntity | undefined>(
    initialListingData
  )
  const [loading, setLoading] = useState(!initialListingData)
  const [userListing, setUserListing] = useState<boolean>(false)
  const [customMessage, setCustomMessage] = useState<string>(
    'Hello, I am interested in your listing!'
  )

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchListing() {
      if (!listingID || initialListingData) return
      const listingURL: string = `/api/listing/${listingID}`

      try {
        const response = (await APIGet(listingURL)) as ListingEntity

        if (response) {
          setListingData(response)
          checkUserListing(response)
        }
      } catch (error) {
        console.log('Request Error')
        navigate('/error')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [listingID, initialListingData])

  const checkUserListing = (listing: ListingEntity) => {
    const userID = localStorage.getItem('userID')

    if (userID === listing.seller_profile.userID) {
      setUserListing(true)
    } else {
      setUserListing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!listingData) return

    const receiverId = listingData.seller_profile.userID
    const listingId = listingData.listingID

    const initialMessage: NewMessage = {
      receiver_id: receiverId,
      listing_id: listingId,
      content: customMessage,
    }

    try {
      await APIPost<NewMessage, NewMessage>('/api/messages', initialMessage)
      navigate('/messaging')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!listingData || !listingID) {
    return <div>Listing not found</div>
  }

  return (
    <div className="Listing">
      <header className="App-header">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            alignItems: 'center',
            marginTop: 1,
            width: '90%',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Paper
              sx={{
                padding: '20px',
                height: '85vh',
                backgroundColor: '#ffffff',
              }}
            >
              <Typography sx={{ fontWeight: '700' }}>Photo Gallery</Typography>
              <PhotoGallery images={listingData.images} />
            </Paper>
            <Paper
              sx={{
                minWidth: '40vw',
                ml: 5,
                backgroundColor: '#656565',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
              }}
              component="form"
              onSubmit={(e) => {
                e.preventDefault()

                if (userListing) {
                  navigate(`/edit-listing/${listingID}`)
                }
              }}
            >
              <Box>
                <SellerCard data={listingData} />
                <Reviews
                  listingID={listingID}
                  initialReviews={listingData?.reviews ?? []}
                />
              </Box>
              {userListing ? (
                <Box display={'flex'} flexDirection={'row-reverse'}>
                  <Button variant="contained" type="submit" data-testid="EditButton">
                    Edit
                  </Button>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    label="Message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    margin="normal"
                    InputProps={{
                      style: {
                        color: 'white',
                        borderColor: 'white',
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        color: 'white',
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                    }}
                  />

                  <Box display={'flex'} flexDirection={'row-reverse'}>
                    <Button variant="contained" onClick={handleSendMessage}>
                      Send Message
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </header>
    </div>
  )
}

export default Listing
