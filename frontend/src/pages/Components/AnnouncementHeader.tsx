import React, { useEffect, useState } from 'react'
import { APIGet } from '../../APIlink'
import { CharityEntity } from '../../interfaces'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const mockCharity: CharityEntity = {
  id: '1',
  name: 'Mock Charity Event',
  description: 'This is a mock charity event for testing purposes.',
  startDate: new Date(),
  endDate: new Date(),
  imageUrl: 'mock-image-url',
  organizations: [
    {
      name: 'Mock Organization',
      logoUrl: 'mock-logo-url',
      donated: 1000,
      received: true,
    },
  ],
  funds: 5000,
  listingsCount: 10,
}

const AnnouncementHeader: React.FC = () => {
  const [charity, setCharity] = useState<CharityEntity | null>(null)

  useEffect(() => {
    const fetchCurrentCharity = async () => {
      try {
        const data = await APIGet<CharityEntity>('/api/charities/current')
        setCharity(data)
      } catch (error) {
        setCharity(mockCharity)
        console.error('Failed to fetch current charity', error)
      }
    }

    fetchCurrentCharity()
  }, [])

  if (!charity) return null

  return (
    <Box
      sx={{
        bgcolor: '#25496A',
        color: 'white',
        textAlign: 'center',
        paddingX: 8,
        paddingY: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Current Charity Event: {charity.name}
      </Typography>
      <Typography variant="body1">Amount Raised: ${charity.funds}</Typography>
    </Box>
  )
}

export default AnnouncementHeader
