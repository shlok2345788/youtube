import { Sidebar } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import React from 'react'

const index = () => {
  return (
    <div >
      <Navbar />
      <div className='h-screen bg-white'></div>
      <Sidebar />

    </div>
  )
}

export default index