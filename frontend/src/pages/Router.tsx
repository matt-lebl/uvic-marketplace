import * as React from 'react'
import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import Login from './Login'
import Registration from './Registration'
import Home from './Home'
import Profile from './Profile'
import Listing from './Listing'
import Messaging from './Messaging'
import LoginHeader from './Components/LoginHeader'
import Header from './Components/Header'
import CreateListing from './CreateListing'
import EditListing from './EditListing'
import Search from './Search'
import ValidateEmail from './ValidateEmail'
import Events from './Events'
import Footer from './Components/Footer'

const Router = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('userID')
    if (user) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register' && !currentPath.startsWith('/validate-email')) {
        navigate('/login')
      }
    }
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<Layout loggedIn={loggedIn} />}>
        {!loggedIn ? (
          <>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Registration />} />
            <Route path="validate-email" element={<ValidateEmail />} />
          </>
        ) : (
          <>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="listing/:listingID" element={<Listing />} />
            <Route path="messaging" element={<Messaging />} />
            <Route path="new-listing" element={<CreateListing />} />
            <Route path="edit-listing" element={<EditListing />} />
            <Route path="search" element={<Search />} />
            <Route path="events" element={<Events />} />
          </>
        )}
      </Route>
    </Routes>
  )
}

function Layout({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div>
      <HeaderLayout loggedIn={loggedIn} />
      <Outlet />
    </div>
  )
}

function HeaderLayout({ loggedIn }: { loggedIn: boolean }) {
  return loggedIn ? <Header /> : <LoginHeader />
}

export default Router
