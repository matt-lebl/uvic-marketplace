import React, { FormEvent } from 'react'
import './App.css'
import { Typography, Box, Paper, InputBase, Button } from '@mui/material'
import PhotoPreviewList from './Components/PhotoPreviewList'
import { useState } from 'react'
import { ChangeEvent } from 'react'


function CreateListing() {
    const [title, setTitle] = useState<string>('')

    const [desc, setDesc] = useState<string>('')

    const [pics, setPics] = useState(null)

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
    }

    return (
        <div className="Create-Listing">
            <header className="App-header">
                <Box component='form' sx={{ display: 'flex', flexDirection: 'row', height: '85vh' }} onSubmit={handleSubmit}>
                    <Paper sx={{
                        width: '85vw',
                        hieght: 200,
                        backgroundColor: '#656565',
                        maxHeight: '85vh',
                        overflow: 'auto',
                        p: '20px'
                    }}>
                        <Typography variant='h2'>New Listing</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'cloumn' }}></Box>
                        <Paper sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: '20px', m: '20px 0px 10px 0px' }}>
                            <InputBase
                                id="Listing-Title"
                                placeholder='Listing Title'
                                fullWidth={true}
                                multiline={true}
                                sx={{ fontWeight: 700 }}
                                onChange={titleChange}
                            />
                        </Paper>
                        <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
                            <InputBase
                                id="Listing-Description"
                                placeholder='Listing Description'
                                fullWidth={true}
                                multiline={true}
                                sx={{ pb: '100px'}}
                                onChange={descChange}
                            />
                        </Paper>
                        <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
                            <Box>
                                <Typography>Photos (max 8)</Typography>
                                <PhotoPreviewList/>
                            </Box>
                        </Paper>

                        <Box display={'flex'} flexDirection={'row-reverse'}>
                            <Button variant='contained' type='submit'>Submit</Button>
                        </Box>
                    </Paper>
                </Box>
            </header>
        </div>
    )
}

export default CreateListing
