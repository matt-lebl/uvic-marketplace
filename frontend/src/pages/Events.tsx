import * as React from 'react'
import EventCard from './Components/EventCard'
import { Box, Grid, Typography} from '@mui/material'
import { useState, useEffect } from 'react'
import { APIGet } from '../APIlink'
import { CharityEntity } from '../interfaces'

const nullresponse: CharityEntity = {
    id: '1',
    name: 'Event not found',
    description: 'no description', // need a date/time obj
    startDate: 0,
    endDate: 0,
    imageUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    organizations: [],
    funds: 0,
    listingsCount: 0
}

export default function Events() {

    const [curCharityEvent, setCurCharityEvent] = useState<CharityEntity>(nullresponse)
    const [charityEvents, setCharityEvents] = useState<Array<CharityEntity>>([])

    const fetchMainEvent = async() => {
        try{
            const response:CharityEntity = await APIGet('/api/charities/current')
            setCurCharityEvent(response)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAllEvents = async() => {
        try{
            const response: Array<CharityEntity> = await APIGet('/api/charities')
            setCharityEvents(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMainEvent()
    })

    useEffect(() => {
        fetchAllEvents()
    })

    return (
        <div className='EventsPage'>
            <Box display='flex' alignItems='center' justifyContent='center' width='100%' flexDirection='column'>
                <Typography variant='h4' alignSelf='start' m='20px 0 0 10%'>Charity Events</Typography>
                <Grid container spacing={1} sx={{ display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item md={12}>
                        <EventCard eventData={curCharityEvent} />
                    </Grid>
                    {charityEvents.map((eventData) => (
                        <Grid item md={6} key={eventData.id} >
                            <EventCard eventData={eventData}/>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
}