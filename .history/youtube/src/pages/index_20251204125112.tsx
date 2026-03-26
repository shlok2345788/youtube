import Navbar from '../components/ui/Navbar'
import React from 'react'
import CategoryTabs from '@/components/CategoryTabs'
import Sidebar from '@/components/Sidebar'

const index = () => {
  return (
    <div className='h-screen bg-white' >
      <Navbar />
      <CategoryTabs />
      <Sidebar />
    </div>
  )
}

export default index