import * as React from 'react'
import EventCard from './Components/EventCard'
import { Box, Grid, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { APIGet } from '../APIlink'
import { CharityEntity, OrgEntity } from '../interfaces'
import { useNavigate } from 'react-router-dom'

export default function Events() {
  const navigate = useNavigate()
  const [curCharityEvent, setCurCharityEvent] = useState<CharityEntity>()
  const [charityEvents, setCharityEvents] = useState<Array<CharityEntity>>([])

  const fetchMainEvent = async () => {
    try {
      const response: CharityEntity = await APIGet('/api/charities/current')
      setCurCharityEvent(response)
    } catch (error) {
      debugger
      console.error("Failed to get Current Charaity Event")
      navigate('/error')
    }
  }

  const fetchAllEvents = async () => {
    try {
      const response: Array<CharityEntity> = await APIGet('/api/charities')
      setCharityEvents(response)
    } catch (error) {
      debugger
      console.error("Failed to get all charity events")
      navigate('/error')
    }
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
