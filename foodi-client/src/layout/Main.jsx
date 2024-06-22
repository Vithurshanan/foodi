import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'
import "../App.css"
import Footer from '../components/Footer'

const Main = () => {
  return (
    <div >
     <Nav />
     <Outlet />
     <Footer />
    </div>
  )
}

export default Main
