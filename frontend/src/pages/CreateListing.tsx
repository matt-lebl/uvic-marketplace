import React from 'react'
import './App.css'
import { Typography, Box, Paper, InputBase, Button } from '@mui/material'
import PhotoPreviewList from './Components/PhotoPreviewList'


function CreateListing() {
    return (
        <div className="Create-Listing">
            <header className="App-header">
                <Box component='form' sx={{ display: 'flex', flexDirection: 'row', height: '85vh' }}>
                    <Paper sx={{
                        maxWidth: '95vw',
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
                            />
                        </Paper>
                        <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
                            <InputBase
                                id="Listing-Description"
                                placeholder='Listing Description'
                                fullWidth={true}
                                multiline={true}
                                sx={{ pb: '100px'}}
                            />
                        </Paper>
                        <Paper sx={{ flexGrow: 1, p: '20px', m: '10px 0px 10px 0px' }}>
                            <Box>
                                <Typography>Photos</Typography>
                                <PhotoPreviewList/>
                                <Button variant='contained'>Upload Photos</Button>
                            </Box>
                        </Paper>

                        <Box display={'flex'} flexDirection={'row-reverse'}>
                            <Button variant='contained'>Submit</Button>
                        </Box>
                    </Paper>
                </Box>
            </header>
        </div>
    )
}

export default CreateListing
