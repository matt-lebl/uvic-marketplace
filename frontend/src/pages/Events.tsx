import EventCard from './Components/EventCard'
import { Box, Grid, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { APIGet } from '../APIlink'
import { CharityEntity } from '../interfaces'
import { useNavigate } from 'react-router-dom'

export default function Events() {
  const navigate = useNavigate()
  const [curCharityEvent, setCurCharityEvent] = useState<CharityEntity>()
  const [charityEvents, setCharityEvents] = useState<Array<CharityEntity>>([])

  const fetchMainEvent = () => {
    setTimeout(async () => {
      await APIGet<CharityEntity>('/api/charities/current')
        .catch((error) => {
          debugger;
          console.error('Failed to fetch current charity')
          navigate('/error')
        })
        .then((response) => {
          if (response) { setCurCharityEvent(response) }
        })
    }, 1000);
  }

  const fetchAllEvents = () => {
    setTimeout(async () => {
      await APIGet<Array<CharityEntity>>('/api/charities')
        .catch((error) => {
          debugger;
          console.error('Failed to fetch all charities')
          navigate('/error')
        })
        .then((response) => { if (response) { setCharityEvents(response) } })
    }, 1000);
  }

  useEffect(() => {
    fetchMainEvent()
  }, [])

  useEffect(() => {
    fetchAllEvents()
  }, [])

  if (!curCharityEvent || !charityEvents) {
    return <Typography>No Events Found</Typography>
  }

  return (
    <div className="EventsPage">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        flexDirection="column"
      >
        <Typography variant="h4" alignSelf="start" m="20px 0 0 10%">
          Charity Events
        </Typography>
        <Grid
          container
          spacing={1}
          sx={{
            display: 'flex',
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid item md={12}>
            <EventCard eventData={curCharityEvent} />
          </Grid>
          {charityEvents.map((eventData, key) => (
            <Grid item md={6} key={eventData.id + key}>
              <EventCard eventData={eventData} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}
