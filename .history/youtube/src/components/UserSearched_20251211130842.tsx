import React from 'react'
import { useState, useEffect } from 'react'
import { ALL_VIDEOS, user } from '@/pages/DataContent/Data'
const UserSearched = () => {

  const [videos, setvideos] = useState<any>(null)
  const allVideos = ALL_VIDEOS;

  return (
    <div>UserSearched</div>
  )
}

export default UserSearched