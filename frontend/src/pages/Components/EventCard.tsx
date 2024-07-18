import * as React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { CharityEntity } from '../../interfaces'

interface Props {
    eventData: CharityEntity
}

const EventCard: React.FC<Props> = ({ eventData }) => {
    return (
        <div className={'EventCard#' + eventData.id}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                border: '1px solid black',
                background: '#E3E3DC',
                borderRadius: '10px',
                boxShadow: 2,
                width: '100%',
                padding: '20px 3% 3% 3%',
                m: 2
            }}>
                <Typography variant='h5' sx={{ alignSelf: 'start', m: '0px 0 10px 0' }}>{eventData?.name}</Typography>
                <Paper sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, p: '10px 0 10px 10px', m: '10px 0 20px 0' }}>
                    <Typography sx={{ mr: '40px' }}>Funding: ${eventData?.funds}</Typography>
                    <Typography>Started: {eventData?.startDate}  Ending: {eventData?.endDate}</Typography>
                </Paper>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ m: '0px 4% 0 0', width: '48%', height: '100%' }}>
                        <img src={eventData?.imageUrl} />
                    </Box>
                    <Paper elevation={4} sx={{ minHeight: '100%', width: '48%', p: 2 }}>
                        <Typography >{eventData?.description}</Typography>
                        <Typography >Orgs involved</Typography>
                    </Paper>
                </Box>
            </Box>
        </div>
    )
}

export default EventCard