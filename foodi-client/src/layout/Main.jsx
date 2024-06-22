import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'
import "../App.css"
import Footer from '../components/Footer'

const Main = () => {
  return (
    <div className="bg-prigmayBG">
     <Nav />
     <div >
     <Outlet />
     </div>
     <Footer />
    </div>
  )
}

export default Main
