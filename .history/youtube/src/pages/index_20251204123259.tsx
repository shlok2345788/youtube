import { Sidebar } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import React from 'react'

const index = () => {
  return (
    <div >
      <Navbar />
      <Sidebar />
      <div className='h-screen bg-white'></div>

    </div>
  )
}

export default index