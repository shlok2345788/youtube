import React from 'react'
import { useState, useEffect } from 'react'
import { ALL_VIDEOS, user } from '@/pages/DataContent/Data'
const UserSearched = () => {

  const [videos, setvideos] = useState<typeof ALL_VIDEOS | null>(null)
  const allVideos = ALL_VIDEOS;

  const result = allVideos.filter((vid)=>{
    vid.videotitle.toLowerCase()
  })

  return (
    <div>UserSearched</div>
  )
}

export default UserSearched