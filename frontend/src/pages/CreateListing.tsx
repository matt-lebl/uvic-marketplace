import React, { FormEvent, useState, ChangeEvent } from 'react'
import './App.css'
import { Typography, Box, Paper, InputBase, Button } from '@mui/material'
import PhotoPreviewList from './Components/PhotoPreviewList'
import { ListingEntity } from '../interfaces'
import { APIPost } from '../APIlink'

async function apiSubmit(listing: Partial<ListingEntity>) {
  try {
    const response = await APIPost('/api/listing', { listing })
    console.log('Response:', response)
  } catch (error) {
    console.log('Request Error:', error)
  }
}

function CreateListing() {
  const [title, setTitle] = useState<string>('')
  const [desc, setDesc] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [imageNames, setImageNames] = useState<Array<string>>([])
  const [imageURLs, setImageURLs] = useState<Array<string>>([])
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList

    if (files.length + imageURLs.length > 8) {
      alert('Too many files')
      return
    }

    const names = Array.from(files).map((file) => file.name)
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))

    setImageNames(imageNames.concat(names))
    setImageURLs(imageURLs.concat(urls))
  }

  const handleRemoveAll = () => {
    setImageNames([])
    setImageURLs([])
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const submitListing = {
      title,
      description: desc,
      price,
      location: { latitude, longitude },
      images: imageURLs.map((url) => ({ url })),
      markedForCharity: false,
    }

    apiSubmit(submitListing)
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
              backgroundColor: '#656565',
              maxHeight: '85vh',
              overflow: 'auto',
              p: '20px',
            }}
          >
            <Typography variant="h2">New Listing</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}></Box>
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
                placeholder="Listing Title"
                fullWidth={true}
                multiline={true}
                sx={{ fontWeight: 700 }}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Paper>
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
                id="Listing-Price"
                placeholder="Price"
                fullWidth={true}
                multiline={true}
                sx={{ fontWeight: 700 }}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </Paper>
            <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
              <InputBase
                id="Listing-Description"
                placeholder="Listing Description"
                fullWidth={true}
                multiline={true}
                sx={{ pb: '100px' }}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Paper>
            <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
              <Box>
                <Typography>Photos (max 8)</Typography>
                <PhotoPreviewList imageNames={imageNames} />
                <input
                  id="photoInput"
                  type="file"
                  multiple={true}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <Button
                  variant="contained"
                  sx={{ ml: '20px' }}
                  onClick={handleRemoveAll}
                >
                  Remove All
                </Button>
              </Box>
            </Paper>
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
                id="Listing-Latitude"
                placeholder="Latitude"
                fullWidth={true}
                multiline={true}
                sx={{ fontWeight: 700 }}
                onChange={(e) => setLatitude(Number(e.target.value))}
              />
            </Paper>
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
                id="Listing-Longitude"
                placeholder="Longitude"
                fullWidth={true}
                multiline={true}
                sx={{ fontWeight: 700 }}
                onChange={(e) => setLongitude(Number(e.target.value))}
              />
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

export default CreateListing
