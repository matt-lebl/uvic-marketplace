import React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import ProfileIcon from './ProfileIcon'
import { ListingEntity } from '../../interfaces'

interface SellerCardProps {
  data: ListingEntity
}

const SellerCard: React.FC<SellerCardProps> = ({ data }) => {
  const { seller_profile } = data

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
            <Typography sx={{ m: '30px' }}>
              Bio: {seller_profile.bio}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </div>
  )
}

export default SellerCard
