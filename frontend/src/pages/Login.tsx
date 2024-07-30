import './App.css'
import React from 'react'
import { Typography, Box } from '@mui/material'
import LoginForm from './Components/LoginForm'
import { useState } from 'react'
import ResetPasswordComponent from './Components/ResetPasswordComponent'

function Login() {
  const [showResetPassword, setShowResetPassword] = useState(false)

  return (
    <div className="Login">
      <header className="App-header">
        {!showResetPassword ? (
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
              Forgot your password?{' '}
              <a href="#" onClick={() => setShowResetPassword(true)}>
                Reset password
              </a>
            </Typography>
            <Typography variant="body1" alignSelf="flex-start">
              Don't have an account? <a href="/register">Register</a>
            </Typography>
          </Box>
        ) : (
          <Box
            width={400}
            display="flex"
            flexDirection="column"
            flexWrap="nowrap"
            alignItems="center"
            marginTop={12}
          >
            <Typography variant="h4" alignSelf="flex-start" marginBottom={5}>
              Reset Password
            </Typography>

            <Typography variant="body1" alignSelf="flex-start">
              Enter your email address to reset your password.
            </Typography>
            <ResetPasswordComponent />

            <Typography variant="body1" alignSelf="flex-start">
              <a href="#" onClick={() => setShowResetPassword(false)}>
                Back to login
              </a>
            </Typography>
          </Box>
        )}
      </header>
    </div>
  )
}

export default Login
