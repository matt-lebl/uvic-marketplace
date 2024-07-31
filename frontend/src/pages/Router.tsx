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
import APIError, { APIGet } from '../APIlink'
import ErrorPage from './ErrorPage'

const Router = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const currentPath = window.location.pathname
    if (
      currentPath !== '/login' &&
      currentPath !== '/register' &&
      !currentPath.startsWith('/validate-email')
    ) {
      const userID = localStorage.getItem('userID')
      if (userID) {
        const getUser = async () => {
          await APIGet<string>(`/api/user/` + userID)
            .then((response: string) => {
              setLoggedIn(true)
            })
            .catch((error: any) => {
              if (error instanceof APIError && (error.status === 401 || error.status === 403)) {
                localStorage.clear()
                setLoggedIn(false)
                navigate('/login')
              } else {
                navigate('/error')
              }
            })
        }
        getUser()
      } else {
        setLoggedIn(false)
        navigate('/login')
      }
    }
  }, [navigate])

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout loggedIn={loggedIn}
        />}>
        {!loggedIn ? (
          <>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Registration />} />
            <Route path="validate-email" element={<ValidateEmail />} />
            <Route path="error" element={<ErrorPage />} />
          </>
        ) : (
          <>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="listing/:listingID" element={<Listing />} />
            <Route path="messaging" element={<Messaging />} />
            <Route path="new-listing" element={<CreateListing />} />
            <Route path="edit-listing/:listingID" element={<EditListing />} />
            <Route path="search" element={<Search />} />
            <Route path="events" element={<Events />} />
            <Route path="error" element={<ErrorPage />} />
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
