import { Routes, Route, Outlet } from 'react-router-dom'
import Index from './Index'
import Login from './Login'
import Registration from './Registration'
import Home from './Home'
import Profile from './Profile'
import Listing from './Listing'
import LoginHeader from './LoginHeader'
import Header from './Header'
import { useState } from 'react'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
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
      <HeaderLayout/>
      <Outlet />
    </div>
  )
}

function HeaderLayout() {
  let url = window.location.href;
  let result = <Header/>

  if(url.includes("/login") || url.includes("/register")) result = <LoginHeader/>;

  return(
    result
  )
}

export default Router