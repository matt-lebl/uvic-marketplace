import React, { useEffect, useState } from 'react'
import { APIGet } from '../../APIlink'
import { CharityEntity } from '../../interfaces'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

const AnnouncementHeader: React.FC = () => {
  const navigate = useNavigate()

  const [charity, setCharity] = useState<CharityEntity | null>(null)

  useEffect(() => {
    setTimeout(async () => {
      await APIGet<CharityEntity>('/api/charities/current')
        .catch((error) => {
          debugger;
          console.error('Failed to fetch current charity')
          navigate('/error')
        })
        .then((data) => setCharity(data ?? null))
    }, 1000);
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
