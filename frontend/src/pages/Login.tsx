import './App.css'
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
        </Box>
      </header>
    </div>
  )
}

export default Login
