import * as React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Login from './Login'
import Registration from './Registration'
import Home from './Home'
import Profile from './Profile'
import Listing from './Listing'
import LoginHeader from './Components/LoginHeader'
import Header from './Components/Header'
import { useAuth } from './Components/AuthContext'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Registration />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="listing"
          element={
            <ProtectedRoute>
              <Listing />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

function Layout() {
  return (
    <div>
      <HeaderLayout />
      <Outlet />
    </div>
  )
}

/*
Function that checks the URL and switches the header displayed
Currently only checks if you are on the login or register page
If you are on the login or register page a different header gets displayed
*/
function HeaderLayout() {
  const { isAuthenticated } = useAuth()
  const url = window.location.pathname
  let result = <Header />

  if (!isAuthenticated || url.includes('/login') || url.includes('/register')) {
    result = <LoginHeader />
  }

  return result
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

export default Router
