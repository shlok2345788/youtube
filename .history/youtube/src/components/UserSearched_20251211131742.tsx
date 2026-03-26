import React from 'react'
import { useState, useEffect } from 'react'
import { ALL_VIDEOS, user } from '@/pages/DataContent/Data'
interface UserSearchedProps {
  query: string;
}

const UserSearched = ({ query }: UserSearchedProps) => {

  const [videos, setvideos] = useState<typeof ALL_VIDEOS | null>(null)

  const video = async () => {

    const allVideos = ALL_VIDEOS;
    const result = allVideos.filter((vid) => {
      vid.videotitle.toLowerCase().includes(query.toLowerCase()) ||
        vid.videochanel.toLowerCase().includes(query.toLowerCase())
    });
    setvideos(result)
  }
  if (!videos) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-600">
          Try different keywords or remove search filters
        </p>
      </div>
    );
  }

  const hasVideo = video ? 

  return (
    <div>UserSearched</div>
  )
}

export default UserSearched