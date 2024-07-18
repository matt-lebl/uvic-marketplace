import * as React from 'react'
import EventCard from './Components/EventCard'
import { Box, Grid} from '@mui/material'

export default function Events() {

    const oldEventIds = ['1', '2', '3']

    return (
        <div className='EventsPage'>
            <Box display='flex' alignItems='center' justifyContent='center' width='100%' >
                <Grid container spacing={1} sx={{ display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item md={12}>
                        <EventCard eventId='123' />
                    </Grid>
                    {oldEventIds.map((id) => (
                        <Grid item md={6} >
                            <EventCard eventId={id}/>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
}