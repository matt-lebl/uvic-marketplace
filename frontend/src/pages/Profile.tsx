import React, { useState, useEffect } from 'react'
import './App.css'
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Pagination,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CardActionArea,
} from '@mui/material'
import { User, ListingSummary } from '../interfaces'
import { useNavigate } from 'react-router-dom'
import { APIGet, APIPost, APIDelete } from '../APIlink'

const currentUser: User = {
  userID: localStorage.getItem('userID') || '',
  username: localStorage.getItem('username') || '',
  name: localStorage.getItem('name') || '',
  bio: localStorage.getItem('bio') || '',
  profileUrl: localStorage.getItem('profileUrl') || '',
  email: localStorage.getItem('email') || '',
}

interface ProfileProps {
  user: User
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [editMode, setEditMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [listingsPerPage, setListingsPerPage] = useState(2)
  const [listings, setListings] = useState<ListingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(user.username)
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)

  const navigate = useNavigate()

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
      profilePictureUrl: user.profileUrl,
      ignoreCharityListings: false,
    }

    try {
      await APIPost('/api/user/', updatedUser)
      localStorage.setItem('username', username)
      localStorage.setItem('name', name)
      localStorage.setItem('email', user.email)
      localStorage.setItem('bio', bio)
      setEditMode(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    setUsername(user.username)
    setName(user.name)
    setBio(user.bio)
    setEditMode(false)
  }

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

  const handleRemoveSearchHistory = () => {
    setTimeout(async () => {
      await APIDelete(`/api/user/search-history`).catch((error) => {
        console.error('Error removing search history:', error)
        navigate('/error')
      })
    }, 1000)
  }

  useEffect(() => {
    updateListingsPerPage()
    window.addEventListener('resize', updateListingsPerPage)
    return () => window.removeEventListener('resize', updateListingsPerPage)
  }, [])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const fetchedListings = await APIGet<ListingSummary[]>('/api/listing')
        console.log(fetchedListings)

        setListings(fetchedListings)
      } catch (error) {
        console.error('Failed to fetch listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [user.userID])

  const currentListings = listings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  )

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
            src={user.profileUrl}
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
              <Button
                onClick={handleRemoveSearchHistory}
                sx={{ alignSelf: 'flex-start' }}
                variant="contained"
              >
                Clear Search History
              </Button>
            </>
          )}
        </Box>
      </Box>
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
          {loading ? (
            <Grid
              item
              sx={{
                display: 'flex',
                minHeight: '20vh',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Typography variant="h6">Loading...</Typography>
            </Grid>
          ) : listings.length === 0 ? (
            <Grid
              item
              sx={{
                display: 'flex',
                minHeight: '20vh',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Typography variant="h6">No Listings</Typography>
            </Grid>
          ) : (
            currentListings.map((listing) => (
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
                    borderRadius: '16px',
                    boxSizing: 'border-box',
                    background: '#B5DBFF',
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate(`/listing/${listing.listingID}`)
                    }}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '100%',
                      width: '100%',
                      padding: '16px',
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
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        {listings.length > listingsPerPage && !loading && (
          <Pagination
            count={Math.ceil(listings.length / listingsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
          />
        )}
      </Box>
    </Box>
  )
}
const ProfileContainer: React.FC = () => {
  return <Profile user={currentUser} />
}

export default ProfileContainer
