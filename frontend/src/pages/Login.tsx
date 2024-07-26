import './App.css'
import React from 'react'
import { Typography, Box } from '@mui/material'
import LoginForm from './Components/LoginForm'

function Login() {
  return (
    <div className="Login">
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
            Login
          </Typography>

          <LoginForm />

          <Typography variant="body1" alignSelf="flex-start" marginTop={2}>
            Don't have an account? <a href="/register">Register</a>
          </Typography>
        </Box>
      </header>
    </div>
  )
}

export default Login
