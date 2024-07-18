import * as React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { APIGet } from '../../APIlink'
import { CharityEntity } from '../../interfaces'
import { useEffect, useState } from 'react'

interface Props {
    eventId: string
}

const nullresponse: CharityEntity = {
    id: '',
    name: 'Event not found',
    description: 'no description', // need a date/time obj
    startDate: 0,
    endDate: 0,
    imageUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    organizations: [],
    funds: 0,
    listingsCount: 0
}

const EventCard: React.FC<Props> = ({ eventId }) => {

    const [eventData, setEventData] = useState<CharityEntity>(nullresponse)

    const eventUrl = '/api/charity/' + eventId

    const fetchEventData = async () => {
        try {
            const response: CharityEntity = await APIGet(eventUrl)
            setEventData(response)
        } catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        fetchEventData()
    }, [])

    return (
        <div className={'EventCard#' + eventId}>
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
                <Typography variant='h2' sx={{ alignSelf: 'start', m: '0px 0 10px 0' }}>{eventData?.name}</Typography>
                <Paper sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, p: '10px 0 10px 10px', m: '10px 0 20px 0' }}>
                    <Typography sx={{ mr: '40px' }}>Funding: ${eventData?.funds}</Typography>
                    <Typography>Started: {eventData?.startDate}  Ending: {eventData?.endDate}</Typography>
                </Paper>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ m: '0px 10% 0 0', width: '45%', height: '100%' }}>
                        <img src={eventData?.imageUrl} />
                    </Box>
                    <Paper elevation={4} sx={{ minHeight: '100%', width: '45%', p: 2 }}>
                        <Typography >{eventData?.description}</Typography>
                        <Typography >Orgs involved</Typography>
                    </Paper>
                </Box>
            </Box>
        </div>
    )
}

export default EventCard