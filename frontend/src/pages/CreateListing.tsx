import React, { FormEvent } from 'react'
import './App.css'
import { Typography, Box, Paper, InputBase, Button } from '@mui/material'
import PhotoPreviewList from './Components/PhotoPreviewList'
import { useState } from 'react'
import { ChangeEvent } from 'react'
import { ListingEntity } from '../interfaces'

function apiSubmit(listing: ListingEntity) {

}

function CreateListing() {
  const [title, setTitle] = useState<string>('')

  const [desc, setDesc] = useState<string>('')

  const [imageNames, setImageNames] = useState<Array<string>>([])
  const [imageURLs, setImageURLs] = useState<Array<string>>([])

  const handlPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList

    if (files.length + imageURLs.length > 8) {
      alert('Too many files')
      return
    }

    let names = Array<string>(files.length)
    let urls = Array<string>(files.length)

    for (let i = 0; i < files.length; i++) {
      names[i] = files[i].name
      urls[i] = URL.createObjectURL(files[i])
      console.log(urls[i])
    }

    setImageNames(imageNames.concat(names))
    setImageURLs(imageURLs.concat(urls))

  }

  const handleRemoveAll = () => {
    setImageNames([])
    setImageURLs([])
  }

  const titleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const descChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    console.log(title)
    console.log(desc)
    console.log(imageNames[0])
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
            <Typography variant="h2">New Listing</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'cloumn' }}></Box>
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
                onChange={titleChange}
              />
            </Paper>
            <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
              <InputBase
                id="Listing-Description"
                placeholder="Listing Description"
                fullWidth={true}
                multiline={true}
                sx={{ pb: '100px' }}
                onChange={descChange}
              />
            </Paper>
            <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
              <Box>
                <Typography>Photos (max 8)</Typography>
                <PhotoPreviewList imageNames={imageNames}/>
                <input id='photoInput' type="file" multiple={true} max={8} onChange={handlPhotoUpload}></input>
                <Button variant="contained" sx={{ ml: '20px' }} onClick={handleRemoveAll}>
                  Remove All
                </Button>
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

export default CreateListing
