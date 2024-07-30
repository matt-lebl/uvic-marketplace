import React, { useState, useEffect } from 'react'
import './App.css'
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  TextField,
  Button,
  Pagination,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material'
import { User, ListingSummary } from '../interfaces'
import { APIGet, APIPost } from '../APIlink'

const currentUser: User = {
  userID: localStorage.getItem('userID') || '',
  username: localStorage.getItem('username') || '',
  name: localStorage.getItem('name') || '',
  bio: localStorage.getItem('bio') || '',
  profileUrl: localStorage.getItem('profileUrl') || '',
  email: localStorage.getItem('email') || '',
}

const mockListings: ListingSummary[] = [
  {
    listingID: '1',
    sellerID: '1',
    sellerName: 'First Last',
    title: 'Couch Item Title 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 75,
    dateCreated: '2023-01-01',
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291Y2h8ZW58MHx8MHx8fDA%3D',
    charityID: '1',
  },
  {
    listingID: '2',
    sellerID: '1',
    sellerName: 'First Last',
    title: 'Couch Item Title 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 50,
    dateCreated: '2023-01-02',
    imageUrl:
      'https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvdWNofGVufDB8fDB8fHww',
    charityID: '1',
  },
  {
    listingID: '3',
    sellerID: '1',
    sellerName: 'First Last',
    title: 'Couch Item Title 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 75,
    dateCreated: '2023-01-01',
    imageUrl:
      'https://images.unsplash.com/photo-1511401139252-f158d3209c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvdWNofGVufDB8fDB8fHww',
    charityID: '1',
  },
  {
    listingID: '4',
    sellerID: '1',
    sellerName: 'First Last',
    title: 'Couch Item Title 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 50,
    dateCreated: '2023-01-02',
    imageUrl:
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvdWNofGVufDB8fDB8fHww',
    charityID: '1',
  },
  {
    listingID: '5',
    sellerID: '1',
    sellerName: 'First Last',
    title: 'Couch Item Title 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 75,
    dateCreated: '2023-01-01',
    imageUrl:
      'https://images.unsplash.com/photo-1590251024078-8a6d9f90b02d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGNvdWNofGVufDB8fDB8fHww',
    charityID: '1',
  },
  {
    listingID: '6',
    sellerID: '1',
    sellerName: 'First Last',
    title: 'Couch Item Title 6',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 50,
    dateCreated: '2023-01-02',
    imageUrl:
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNvdWNofGVufDB8fDB8fHww',
    charityID: '1',
  },
]

interface ProfileProps {
  user: User
  listings: ListingSummary[]
}

const Profile: React.FC<ProfileProps> = ({ user, listings }) => {
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [listingsPerPage, setListingsPerPage] = useState(2)
  const [username, setUsername] = useState(user.username)
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [profilePictureUrl, setProfilePictureUrl] = useState(user.profileUrl)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value)
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleLogout = async () => {
    try {
      await APIPost('/api/user/logout')
      localStorage.clear()
      window.location.href = '/'
    } catch (error) {
      console.error('Failed to logout:', error)
      alert('Logout failed. Please try again.')
    }
  }

  const handleSave = async () => {
    const updatedUser = {
      username,
      name,
      email: user.email,
      bio,
      profilePictureUrl,
      ignoreCharityListings: false,
    }

    try {
      await APIPost('/api/user/', updatedUser)
      localStorage.setItem('username', username)
      localStorage.setItem('name', name)
      localStorage.setItem('email', user.email)
      localStorage.setItem('bio', bio)
      localStorage.setItem('profileUrl', profilePictureUrl)
      setEditMode(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    setUsername(user.username)
    setName(user.name)
    setBio(user.bio)
    setProfilePictureUrl(user.profileUrl)
    setEditMode(false)
  }

  const currentListings = listings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  )

  const updateListingsPerPage = () => {
    const width = window.innerWidth
    if (width > 1740) {
      setListingsPerPage(3)
    } else if (width > 1200) {
      setListingsPerPage(2)
    } else {
      setListingsPerPage(1)
    }
  }

  useEffect(() => {
    updateListingsPerPage()
    window.addEventListener('resize', updateListingsPerPage)
    return () => window.removeEventListener('resize', updateListingsPerPage)
  }, [])

  return (
    <Box sx={{ margin: 6 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 12,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={profilePictureUrl}
            sx={{ width: 150, height: 150, marginRight: 8 }}
          />
          {editMode ? (
            <Box>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                sx={{ marginBottom: 1 }}
              />
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ marginBottom: 1 }}
              />

              <TextField
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ marginBottom: 1 }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" fontSize="4rem">
                  {name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" fontSize="1.5rem">
                  {user.email}
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', paddingTop: 2 }}
              >
                <Typography variant="h4" fontSize="1rem">
                  {bio || ''}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignSelf: 'stretch', gap: '10px' }}>
          {editMode ? (
            <>
              <Button
                onClick={handleSave}
                sx={{ alignSelf: 'flex-start' }}
                variant="contained"
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                sx={{ alignSelf: 'flex-start' }}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={toggleEditMode}
                sx={{ alignSelf: 'flex-start' }}
                variant="contained"
              >
                Edit
              </Button>
              <Button
                onClick={handleLogout}
                sx={{ alignSelf: 'flex-start' }}
                variant="contained"
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Box>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Active Listings" />
        <Tab label="Sold" />
        <Tab label="Saved" />
      </Tabs>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: 2,
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          {currentListings.map((listing) => (
            <Grid item key={listing.listingID}>
              <Card
                key={listing.listingID}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 2,
                  width: '40vh',
                  height: '30vh',
                  padding: '16px',
                  borderRadius: '16px',
                  boxSizing: 'border-box',
                  background: '#B5DBFF',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '60%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: '100%',
                      width: 'auto',
                      objectFit: 'fill',
                      borderRadius: '10px',
                    }}
                    image={listing.imageUrl}
                    alt={listing.title}
                  />
                </Box>
                <CardContent sx={{ width: '100%' }}>
                  <Typography component="h5" variant="h5">
                    {listing.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    ${listing.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {listing.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        <Pagination
          count={Math.ceil(listings.length / listingsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  )
}
const ProfileContainer: React.FC = () => {
  return <Profile user={currentUser} listings={mockListings} />
}

export default ProfileContainer
