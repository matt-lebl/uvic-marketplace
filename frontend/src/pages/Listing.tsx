import React from 'react'
import './App.css'
import { Typography, Box, Paper } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import SellerCard from './Components/SellerCard'
import { useParams } from 'react-router-dom'
import { APIGet } from '../APIlink'
import { ListingEntity } from '../interfaces'

function listingRequest(listingID: string | undefined) {

  let response: ListingEntity | undefined

  const listingURL: string = '/api/listing/' + listingID

  setTimeout(async () => {
    try {
      response = await APIGet(listingURL)

      if (response) {
        console.log('Response Title' + response.title)
        console.log('Response' + response)
      }
    } catch (error) {
      console.log('Request Error' + error)
    }
  }, 1000)

  return response
}

function Listing() {

  const { listingID } = useParams();

  const listingData = listingRequest(listingID);

  return (
    <div className="Listing">
      <header className="App-header">
        <Box sx={{ display: 'flex', flexDirection: 'row', }}>
          <Paper sx={{
            padding: '20px 20px 20px 20px',
            height: '85vh',
            backgroundColor: '#ffffff'
          }}>
            <Typography sx={{ fontWeight: '700', }}>Photo Gallery{listingID}</Typography>
            <PhotoGallery />
          </Paper>
          <Paper
            sx={{
              minWidth: '40vw',
              hieght: 200,
              ml: 5,
              backgroundColor: '#656565',
              height: '85vh',
              overflow: 'auto',
            }}
          >
            <SellerCard data={listingData} />
          </Paper>
        </Box>
      </header>
    </div>
  )
}

export default Listing
