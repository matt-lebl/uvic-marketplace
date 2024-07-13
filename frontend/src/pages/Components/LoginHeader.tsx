import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom'
=======
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from '@mui/material'
>>>>>>> Implement TOTP QR code generation

export default function LoginHeader() {
  const navigate = useNavigate()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          flexGrow: 1,
          height: '8vh',
          justifyContent: 'center',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h1"
            component="div"
            sx={{ flexGrow: 1, paddingX: 5 }}
          >
<<<<<<< HEAD
            UVic Marketplace
          </Typography>
          <Box
            sx={{
              width: '10vw',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="text"
              color="inherit"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
=======
            <MenuIcon />
          </IconButton>
          <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" color="inherit" underline='none'>
              UVic Marketplace
            </Link>
          </Typography>
          <Button color="inherit" href='/login'>Login</Button>
>>>>>>> Implement TOTP QR code generation
        </Toolbar>
      </AppBar>
    </Box>
  )
}
