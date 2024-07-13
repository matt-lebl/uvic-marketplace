import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

export default function LoginHeader() {
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
            sx={{ paddingX: 5 }}
            overflow={'clip'}
            noWrap
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              UVic Marketplace
            </Link>
          </Typography>
          <Box
            sx={{
              width: '160px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Button variant="text" color="inherit" href="/login">
              Login
            </Button>
            <Button variant="text" color="inherit" href="/register">
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
