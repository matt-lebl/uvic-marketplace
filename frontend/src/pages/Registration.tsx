import React from 'react'
import './App.css'
import { Typography, Box } from '@mui/material'
import RegisterForm from './Components/RegistrationForm'

function Registration() {
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
          <Typography variant="h4" alignSelf="flex-start" marginBottom={5}>
            Register
          </Typography>

          <RegisterForm />
        </Box>
      </header>
    </div>
  )
}

export default Registration
