import * as React from 'react'
import EventCard from './Components/EventCard'
import { Box, Grid, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { APIGet } from '../APIlink'
import { CharityEntity, OrgEntity } from '../interfaces'

const nullorg: OrgEntity = {
    name: 'Organization Name',
    logoUrl: 'https://plus.unsplash.com/premium_vector-1719413717708-4205e5cbe61c?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    donated: 5,
    received: true
}

const nullresponse: CharityEntity = {
    id: '1',
    name: 'Event not found',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', // need a date/time obj
    startDate: '01/08/24',
    endDate: '01/09/24',
    imageUrl: 'https://plus.unsplash.com/premium_vector-1682298589041-29ca4c47bebb?q=80&w=2124&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%',
    organizations: [nullorg, nullorg, nullorg, nullorg, nullorg, nullorg],
    funds: 5000,
    listingsCount: 0
}

export default function Events() {

    const [curCharityEvent, setCurCharityEvent] = useState<CharityEntity>(nullresponse)
    const [charityEvents, setCharityEvents] = useState<Array<CharityEntity>>([nullresponse, nullresponse, nullresponse])

    const fetchMainEvent = async () => {
        try {
            const response: CharityEntity = await APIGet('/api/charities/current')
            setCurCharityEvent(response)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAllEvents = async () => {
        try {
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
                    {charityEvents.map((eventData, key) => (
                        <Grid item md={6} key={eventData.id + key} >
                            <EventCard eventData={eventData} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
}