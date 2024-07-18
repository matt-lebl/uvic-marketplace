import * as React from 'react'
import EventCard from './Components/EventCard'
import { Box } from '@mui/material'

export default function Events() {
    return (
        <div className='EventsPage'>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                    <EventCard eventId='123' />
                </Box>
                <Box sx={{ display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ width: '45%' }}>
                        <EventCard eventId='124' />
                    </Box>
                    <Box sx={{ width: '45%', ml:'8%'}}>
                        <EventCard eventId='124' />
                    </Box>
                </Box>
            </Box>
        </div>
    )
}