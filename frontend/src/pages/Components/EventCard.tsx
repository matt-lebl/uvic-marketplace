import * as React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { APIGet } from '../../APIlink'

interface Props {
    eventId: string
}

async function getCharityByID(eventId : string) {
    let response: any // this needs to be a Charity Entity

    const charityURL: string = '/api/charity/' + eventId

    setTimeout(async () => {
        try {
            response = await APIGet(charityURL)

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


const EventCard: React.FC<Props> = (eventId) => {
    const image = {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
    }



    return (
        <div className='PUT EVENT ID HERE'>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                border: '1px solid black',
                background: '#656565',
                borderRadius: '10px',
                boxShadow: 2,
                width: '100%',
                padding: '20px 3% 3% 3%',
                m: 2
            }}>
                <Typography variant='h2' sx={{ alignSelf: 'start', m: '0px 0 10px 0' }}>Event Name</Typography>
                <Paper sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, p: '10px 0 10px 10px', m: '10px 0 20px 0' }}>
                    <Typography sx={{ mr: '40px' }}>Funding Info</Typography>
                    <Typography>Start/End Date</Typography>
                </Paper>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ m: '0px 10% 0 0', width: '45%', height: '100%' }}>
                        <img src={image.img} />
                    </Box>
                    <Paper elevation={4} sx={{ minHeight: '100%', width: '45%', p: 2 }}>
                        <Typography >Description</Typography>
                        <Typography >Orgs involved</Typography>
                    </Paper>
                </Box>
            </Box>
        </div>
    )
}

export default EventCard