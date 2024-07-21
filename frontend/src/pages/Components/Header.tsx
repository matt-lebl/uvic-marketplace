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
import { SearchRequest } from '../../interfaces'
import { AddData, DataContext, GetData } from '../../DataContext'
import { useContext } from 'react'

const Header: React.FC = () => {
  const searchRequestID = "searchRequest"
  const navigate = useNavigate()
  const context = useContext(DataContext);


  const handleSearch = (query: SearchRequest) => {
    console.log(query)
    AddData(context, searchRequestID, query);
    navigate('/search')
  }

  const name = localStorage.getItem('name') || 'User'


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
          <Button
            onClick={() => navigate('/')}
            sx={{
              color: 'inherit',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              paddingX: 5,
            }}
          >
            <Typography variant="h1" component="div">
              UVic Marketplace
            </Typography>
          </Button>

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
              flexGrow: 1,
            }}
            submit={handleSearch}
            previousSearchRequest={GetData(context, searchRequestID) ?? null}
          />
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <Button
              variant="text"
              onClick={() => navigate('/events')}
              color="inherit"
            >
              Events
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/listing/1234')}
              color="inherit"
            >
              Browse
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/profile')}
              color="inherit"
            >
              My Listings
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/messaging')}
              color="inherit"
            >
              <MarkunreadIcon
                sx={{
                  height: '60px',
                  width: '60px',
                }}
              />
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/new-listing')}
              sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#25496A',
                color: '#B5DBFF',
                fontSize: '30px',
                borderRadius: '10px',
              }}
            >
              +
            </Button>
            <ProfileIcon
              id="header-pfp"
              name={name}
              imageSrc="./Test_Resources/TestProfileImage.jpg"
              onClick={() => navigate('/profile')}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
