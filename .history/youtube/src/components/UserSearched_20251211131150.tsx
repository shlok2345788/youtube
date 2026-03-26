import React from 'react'
import { useState, useEffect } from 'react'
import { ALL_VIDEOS, user } from '@/pages/DataContent/Data'
const UserSearched = ({query} : any) => {

  const [videos, setvideos] = useState<typeof ALL_VIDEOS | null>(null)
  const allVideos = ALL_VIDEOS;

  const result = allVideos.filter((vid)=>{
    vid.videotitle.toLowerCase().includes(query.toLowerCase())||
    vid.videotitle.toLowerCase().includes(query.toLowerCase())||
  })

  return (
    <div>UserSearched</div>
  )
}

export default UserSearched