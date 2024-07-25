import * as React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { CharityEntity } from '../../interfaces'
import OrgList from './OrgList'

interface Props {
  eventData: CharityEntity
}

const EventCard: React.FC<Props> = ({ eventData }) => {
  return (
    <div className={'EventCard#' + eventData.id}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          border: '1px solid black',
          background: '#E3E3DC',
          borderRadius: '10px',
          boxShadow: 2,
          width: '100%',
          padding: '20px 3% 3% 3%',
          m: 2,
        }}
      >
        <Typography variant="h5" sx={{ alignSelf: 'start', m: '0px 0 10px 0' }}>
          {eventData?.name}
        </Typography>
        <Box display="flex" flexDirection="row">
          <Box width="49%" mr="2%">
            <img src={eventData?.imageUrl} />
          </Box>

          <Box width="49%" sx={{ aspectRatio: 16 / 9 }} overflow="auto">
            <Paper
              sx={{ display: 'flex', width: '100%', p: '5px', mb: '10px' }}
            >
              <Typography sx={{ mr: '40px' }}>
                Funding: ${eventData?.funds}
              </Typography>
              <Typography>
                Start:{eventData?.startDate} End:{eventData?.endDate}
              </Typography>
            </Paper>

            <Paper sx={{ width: '100%', p: '5px', mb: '10px' }}>
              <Typography>{eventData?.description}</Typography>
            </Paper>

            <Paper sx={{ width: '100%', p: '5px' }}>
              <OrgList
                orgData={eventData.organizations}
                eventID={eventData.id}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default EventCard
