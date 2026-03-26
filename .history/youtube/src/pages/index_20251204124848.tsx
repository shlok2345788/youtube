import { Sidebar } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import React from 'react'
import CategoryTabs from '@/components/CategoryTabs'

const index = () => {
  return (
    <div className='h-screen bg-white' >
      
      <Navbar />
      <CategoryTabs />
    </div>
  )
}

export default index