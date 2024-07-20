import * as React from 'react'
import { Box, Typography, Paper, List, ListItem } from '@mui/material'
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
                maxHeight: 450,
                padding: '20px 3% 3% 3%',
                m: 2
            }}>
                <Typography variant='h5' sx={{ alignSelf: 'start', m: '0px 0 10px 0' }}>{eventData?.name}</Typography>
                <Box display='flex' flexDirection='row' >

                    <Box display='flex' flexDirection='column' width='49%' mr='2%'><img src={eventData?.imageUrl} /></Box>

                    <Box display='flex' flexDirection='column' width='49%' maxHeight='100%'>
                        <List sx={{ p: '0', maxHeight:'100%', overflow:'auto'}}>
                            <ListItem sx={{ p: '0' }}>
                                <Paper sx={{ display: 'flex', width: '100%', p: '5px' }}>
                                    <Typography sx={{ mr: '40px' }}>Funding: ${eventData?.funds}</Typography>
                                    <Typography>Start:{eventData?.startDate} End:{eventData?.endDate}</Typography>
                                </Paper>
                            </ListItem>
                            <ListItem sx={{ p: '0', m:'10px 0'}}>
                                <Paper sx={{ width: '100%', p: '5px' }}>
                                    <Typography >{eventData?.description}</Typography>
                                </Paper>
                            </ListItem>
                            <ListItem sx={{ p: '0' }}>
                                <Paper sx={{width:'100%', p:'5px'}}>
                                    <Typography >Orgs involved</Typography>
                                </Paper>
                            </ListItem>
                        </List>
                    </Box>

                </Box>
            </Box>
        </div>
    )
}

export default EventCard