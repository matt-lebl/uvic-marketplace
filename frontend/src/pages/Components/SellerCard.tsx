import React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import ProfileIcon from './ProfileIcon'
import { ListingEntity } from '../../interfaces'

interface SellerCardProps {
  data: ListingEntity
}

const SellerCard: React.FC<SellerCardProps> = ({ data }) => {
  const {
    seller_profile,
    title,
    description,
    status,
    dateCreated,
    location,
    images,
    distance,
  } = data

  return (
    <div className="Seller-Card">
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: '50px',
            flexGrow: 1,
          }}
        >
          <ProfileIcon
            id="listing-pfp"
            name="listing-pfp"
            imageSrc={seller_profile.profilePictureUrl}
          />
          <Paper sx={{ flexGrow: 1, ml: '30px' }}>
            <Typography sx={{ m: '30px' }}>Contact Information</Typography>
            <Typography sx={{ m: '30px' }}>
              {seller_profile.username} ({seller_profile.name})
            </Typography>
            <Typography sx={{ m: '30px' }}>Payment Preference</Typography>
          </Paper>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}></Box>
        <Paper
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '80px',
            m: '0 50px 10px 50px',
          }}
        >
          <Typography>Map Placeholder</Typography>
        </Paper>
        <Paper
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            p: '20px',
            m: '10px 50px 10px 50px',
          }}
        >
          <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
        </Paper>
        <Paper
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            p: '20px',
            m: '10px 50px 10px 50px',
          }}
        >
          <Typography>Status: {status}</Typography>
          <Typography sx={{ ml: '20px' }}>
            Date Created: {new Date(dateCreated).toLocaleDateString()}
          </Typography>
        </Paper>
        <Paper
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            p: '20px 0 200px 20px',
            m: '0 50px 10px 50px',
          }}
        >
          <Typography>{description}</Typography>
        </Paper>
      </Box>
    </div>
  )
}

export default SellerCard
