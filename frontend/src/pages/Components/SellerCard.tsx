import React from 'react'
import { Typography, Box, Paper, List, ListItem } from '@mui/material'
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
            <Typography sx={{ m: '10px' }}>
              Seller: {seller_profile.username} ({seller_profile.name})
            </Typography>
            <Typography sx={{ m: '10px' }}>
              Price: ${data.price}
            </Typography>
            <Typography sx={{ m: '10px' }}>
              Bio: {seller_profile.bio}
            </Typography>
          </Paper>

        </Box>
        <Box sx={{px:'50px'}}>
          <Paper sx={{p:'5px', mb:'10px'}}>
            <Typography>{data.title}</Typography>
          </Paper>
          <Paper sx={{p:'5px', mb:'10px'}}>
            <Typography>{data.description}</Typography>
          </Paper>
        </Box>
      </Box>
    </div>
  )
}

export default SellerCard
