import React, { FormEvent, useEffect } from 'react'
import './App.css'
import { Typography, Box, Paper, InputBase, Button } from '@mui/material'
import PhotoPreviewList from './Components/PhotoPreviewList'
import { useState } from 'react'
import { ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ListingEntity, ListingResponse, PatchListing } from '../interfaces'
import { APIGet, APIPatch } from '../APIlink'

function EditListing() {
  const [title, setTitle] = useState<string>('')
  const [desc, setDesc] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [imageNames, setImageNames] = useState<Array<string>>([])
  const [imageURLs, setImageURLs] = useState<Array<string>>([])
  const [latitude, setLatitude] = useState<number | undefined>()
  const [longitude, setLongitude] = useState<number | undefined>()
  const [geolocationError, setGeolocationError] = useState<string | null>(null)
  const [titleError, setTitleError] = useState<boolean>(false)
  const [priceError, setPriceError] = useState<boolean>(false)
  const navigate = useNavigate()

  const { listingID } = useParams();

  const fetchListing = async () => {
    try {
      const listingURL: string = `/api/listing/${listingID}`

      const response: ListingEntity = await APIGet(listingURL)

      if (response) {
        setTitle(response.title)
        setDesc(response.description)
        setPrice(response.price)
        setLatitude(response.location.latitude)
        setLongitude(response.location.longitude)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function patchListing() {

    if (latitude === undefined || longitude === undefined) {
      alert('Location is not available.')
      return
    }

    const listingData : PatchListing = {
      listing: {
        title,
        description: desc,
        price,
        location: { latitude, longitude },
        images: imageURLs.map((url) => ({ url })),
        markedForCharity: false
      },
      status: "AVAILABLE"
    }
    const listingURL: string = `/api/listing/${listingID}`

    try {
      const response: ListingResponse | undefined = await APIPatch(listingURL, listingData)
      console.log(response)
      navigate(`/listing/${listingID}`)
    } catch (error) {
      console.log(error)
      console.log(listingData)
      console.log(title)
    }

  }

  useEffect(() => {
    fetchListing()
  }, [])


  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    patchListing()
  }

  return (
    <div className="Create-Listing">
      <header className="App-header">
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'row', height: '85vh' }}
          onSubmit={handleSubmit}
        >
          <Paper
            sx={{
              width: '85vw',
              hieght: 200,
              backgroundColor: '#656565',
              maxHeight: '85vh',
              overflow: 'auto',
              p: '20px',
            }}
          >
            <Typography variant="h2">Edit Listing</Typography>
            <Paper
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                p: '20px',
                m: '20px 0px 10px 0px',
              }}
            >
              <InputBase
                id="Listing-Title"
                fullWidth={true}
                multiline={true}
                sx={{ fontWeight: 600 }}
                onChange={(e) => setTitle(e.target.value)}
                defaultValue={title}
              ></InputBase>
            </Paper>
            <Paper
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                p: '20px',
                m: '10px 0px 10px 0px',
              }}
            >$
              <InputBase
                id="Listing-Title"
                fullWidth={true}
                multiline={true}
                sx={{ ml: '5px' }}
                onChange={(e) => setPrice(Number(e.target.value))}
                defaultValue={price}
              ></InputBase>
            </Paper>
            <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
              <InputBase
                id="Listing-Description"
                placeholder="Listing Description"
                fullWidth={true}
                multiline={true}
                sx={{ pb: '100px' }}
                onChange={(e) => setDesc(e.target.value)}
                defaultValue={desc}
              />
            </Paper>
            <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
              <Box>
                <Typography>Photos (max 8)</Typography>
                <PhotoPreviewList />
              </Box>
            </Paper>

            <Box display={'flex'} flexDirection={'row-reverse'}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Box>
          </Paper>
        </Box>
      </header>
    </div>
  )
}

export default EditListing
