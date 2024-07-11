import React, { useState } from 'react'
import { BottomNavigation, Typography } from '@mui/material'

const Footer = () => {
  const [value, setValue] = useState(0)

  return (
    <BottomNavigation
      showLabelsw
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f8f8f8',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="h6" gutterBottom>
        UVic Marketplace
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Connecting the UVic community through shared goods and services.
      </Typography>
    </BottomNavigation>
  )
}

export default Footer
