import React from 'react'
import { Typography, Box, Paper, List, ListItem } from '@mui/material'
import ProfileIcon from './ProfileIcon'
import { ListingEntity } from '../../interfaces'
import ListingMap from './ListingMap'


interface SellerCardProps {
  data: ListingEntity
}

const SellerCard: React.FC<SellerCardProps> = ({ data }) => {
  const { seller_profile } = data

  return (
    <div className="Seller-Card" data-testid="seller-card">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: '20px 50px 20px 80px',
          flexGrow: 1,
          maxWidth: '100%'
        }}
      >
        <ProfileIcon
          id="listing-pfp"
          name={seller_profile.name}
          imageSrc={seller_profile.profilePictureUrl}
        />
        <Paper sx={{ flexGrow: 1, ml: '50px' }}>
          <Typography sx={{ m: '10px' }}>
            Seller: {seller_profile.username} ({seller_profile.name})
          </Typography>
          <Typography sx={{ m: '10px' }}>
            Bio: {seller_profile.bio}
          </Typography>
        </Paper>
      </Box>
      <Box sx={{ px: '50px' }}>
        <ListingMap lat={data.location.latitude} long={data.location.longitude} />

        <Box display='flex' flexDirection='row' m='20px 0'>
          <Typography variant='h2' sx={{ p: '5px', mr: '40px' }}>{data.title}</Typography>
          <Typography variant='h2' sx={{ p: '5px' }}>$ </Typography>
          <Typography variant='h2' sx={{ p: '5px' }}>{data.price}</Typography>
        </Box>

        <Paper sx={{ p: '5px', m: '10px 0px' }}>
          <Typography sx={{ overflow: 'wrap', maxWidth: '100%' }}>{data.description}</Typography>
        </Paper>
      </Box>
    </div>
  )
}

export default SellerCard
