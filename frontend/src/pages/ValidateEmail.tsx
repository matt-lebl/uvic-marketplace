import React from 'react'
import './App.css'
import { Typography, Box } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import ValidateEmailComponent from './Components/ValidateEmailComponent'

function ValidateEmail() {
  return (
    <div className="Registration">
      <header className="App-header">
        <Box
          width={400}
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          alignItems="center"
          marginTop={12}
        >
          <ValidateEmailComponent />
        </Box>
      </header>
    </div>
  )
}

export default ValidateEmail
