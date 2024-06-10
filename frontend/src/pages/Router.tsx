import { Routes, Route, Outlet } from 'react-router-dom'
import Index from './Index'
import Login from './Login'
import Registration from './Registration'
import Home from './Home'
import Profile from './Profile'
import Listing from './Listing'
import LoginHeader from './Components/LoginHeader'
import Header from './Components/Header'
import { useState } from 'react'
/*
Add paths for new pages here
path={} is what gets appended to the URL
element={} is the page that gets rendered when that URL is requested

TODO:
Once login authentication is functional this needs to be modified
Users shouldnt be abled to access most pages unless they are logged in
*/
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Registration />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="listing" element={<Listing />} />
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
  const url = window.location.href
  let result = <Header />

  if (url.includes('/login') || url.includes('/register'))
    result = <LoginHeader />

  return result
}

export default Router
