import React, { FormEvent, useEffect, useState } from 'react'
import './App.css'
import {
  Typography,
  Box,
  Paper,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { ListingEntity, ListingResponse, PatchListing } from '../interfaces'
import { APIGet, APIPatch } from '../APIlink'

function EditListing() {
  const [title, setTitle] = useState<string>('')
  const [desc, setDesc] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [latitude, setLatitude] = useState<number | undefined>()
  const [longitude, setLongitude] = useState<number | undefined>()
  const [images, setImages] = useState<{ url: string }[]>([])
  const [titleError, setTitleError] = useState<string | null>(null)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const { listingID } = useParams()

  useEffect(() => {
    fetchListing()
  }, [])

  const fetchListing = async () => {
    try {
      const listingURL: string = `/api/listing/${listingID}`
      const response: ListingEntity = await APIGet(listingURL)

      const userID = localStorage.getItem('userID')
      if (response.seller_profile.userID !== userID) {
        navigate(`/listing/${listingID}`)
        return
      }

      if (response) {
        setTitle(response.title)
        setDesc(response.description)
        setPrice(response.price)
        setLatitude(response.location.latitude)
        setLongitude(response.location.longitude)
        setImages(response.images)
      }
    } catch (error) {
      console.log(error)
      navigate('/error')
    } finally {
      setLoading(false)
    }
  }

  const validateTitle = (title: string) => {
    if (!title) return 'Title is required.'
    if (title.length < 3) return 'Title must be at least 3 characters long.'
    return null
  }

  const validatePrice = (price: number) => {
    if (price <= 0) return 'Price must be greater than zero.'
    return null
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const titleError = validateTitle(title)
    const priceError = validatePrice(price)

    if (titleError || priceError) {
      setTitleError(titleError)
      setPriceError(priceError)
      return
    }

    patchListing()
  }

  async function patchListing() {
    if (latitude === undefined || longitude === undefined) {
      alert('Location is not available.')
      return
    }

    const listingData: PatchListing = {
      listing: {
        title,
        description: desc,
        price,
        location: { latitude, longitude },
        markedForCharity: false,
        images,
      },
      status: 'AVAILABLE',
    }
    const listingURL: string = `/api/listing/${listingID}`

    try {
      const response: ListingResponse | undefined = await APIPatch(
        listingURL,
        listingData
      )
      console.log(response)
      navigate(`/listing/${listingID}`)
    } catch (error) {
      console.error("Failed to Update Listing")
      navigate('/error')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>
  }

  return (
    <div className="Create-Listing">
      <header className="App-header">
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'row', height: '85vh' }}
          onSubmit={handleSubmit}
          onReset={() => navigate(`/listing/${listingID}`)}
        >
          <Paper
            sx={{
              width: '85vw',
              maxHeight: '85vh',
              overflow: 'auto',
              p: '20px',
            }}
          >
            <Typography variant="h2" sx={{ color: '#000000' }}>
              Edit Listing
            </Typography>
            <FormControl fullWidth margin="normal" error={Boolean(titleError)}>
              <TextField
                id="Listing-Title"
                label="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setTitleError(validateTitle(e.target.value))
                }}
                error={Boolean(titleError)}
              />
              <FormHelperText>{titleError}</FormHelperText>
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(priceError)}>
              <TextField
                id="Listing-Price"
                label="Price"
                type="number"
                value={price}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setPrice(value)
                  setPriceError(validatePrice(value))
                }}
                error={Boolean(priceError)}
              />
              <FormHelperText>{priceError}</FormHelperText>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                id="Listing-Description"
                label="Description"
                multiline
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </FormControl>
            <Box display={'flex'} flexDirection={'row-reverse'}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
              <Button variant="contained" type="reset" sx={{ marginRight: 2 }}>
                Cancel
              </Button>
            </Box>
          </Paper>
        </Box>
      </header>
    </div>
  )
}

export default EditListing
