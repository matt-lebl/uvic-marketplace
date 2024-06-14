import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Searchbox from './SearchBox'
import { FormEvent } from 'react'

export default function LoginHeader() {

  const handleSearch = (query:string) => {
    console.log(query)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr:'40px' }}>
            Header
          </Typography>
          <Box sx={{flexGrow:1}}>
          <Searchbox 
            id="Header Searchbar" 
            placeholder='Search UVic Marketplace'
            sx={{m:'0px 0px', p: '4px 4px', display: 'flex', alignItems: 'center', width: 400}}
            submit={handleSearch}
          />
          </Box>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
