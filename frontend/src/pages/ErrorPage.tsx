import React from 'react'
import './App.css'
import { Box, Typography } from '@mui/material'

function ErrorPage() {
  return (
    <div className="Error">
      <header className="App-header">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            alignItems: 'center',
            marginTop: 3,
            width: '90%',
          }}
        >
          <Typography variant="h6" align="center" mt={3}>
            We have encountered an error. Please try again later.
          </Typography>
        </Box>
      </header>
    </div>
  )
}

export default ErrorPage
