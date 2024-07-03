import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ProfileIcon from './ProfileIcon'
import Searchbox from './SearchBox'
import { useNavigate } from 'react-router-dom'
import MarkunreadIcon from '@mui/icons-material/Markunread'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'

export default function Header() {
  const handleSearch = (query: string) => {
    console.log(query)
  }

  const navigate = useNavigate()

  return (
    <Box sx={{ flexGrow: 1, height: '7vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h1"
            component="div"
            sx={{ flexGrow: 0, mr: '40px' }}
          >
            UVic Marketplace
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Searchbox
              id="Header Searchbar"
              placeholder="Search UVic Marketplace"
              sx={{
                m: '0px 0px',
                p: '4px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                borderRadius: 2,
                border: '1px solid',
              }}
              submit={handleSearch}
            />
          </Box>
          <Button
            variant="text"
            onClick={() => navigate('/listing/1234')}
            color="inherit"
            sx={{ mr: '40px' }}
          >
            Browse
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/profile')}
            color="inherit"
            sx={{ mr: '40px' }}
          >
            My Listings
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/new-listing')}
            sx={{
              width: '10px',
              height: '40px',
              backgroundColor: '#25496A',
              color: '#B5DBFF',
              fontSize: '30px',
              borderRadius: '10px',
              mr: '60px',
            }}
          >
            +
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/messaging')}
            color="inherit"
            sx={{ mr: '40px' }}
          >
            <MarkunreadIcon
              sx={{
                height: '50px',
                width: '50px',
              }}
            />
          </Button>
          <ProfileIcon
            id="header-pfp"
            name="header-pfp"
            imageSrc="./Test_Resources/TestProfileImage.jpg"
            onClick={() => navigate('/profile')}
          />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
