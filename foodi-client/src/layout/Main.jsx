import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'
import "../App.css"
import Footer from '../components/Footer'
import { AuthContext } from '../contexts/AuthProvider'
import LoadingSpinner from '../components/LoadingSpinner'

const Main = () => {
  const {loading} = useContext(AuthContext)
  return (
    <div className="bg-prigmayBG">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
        <Nav />
        <Outlet />
        <Footer />
      </div>
      )}
       
    </div>
  )
}

export default Main
