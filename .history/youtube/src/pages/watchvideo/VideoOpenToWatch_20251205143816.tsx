import React from 'react'
import { useRouter } from 'next/router'
import { useState , useEffect } from 'react'

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <div>VideoOpenToWatch</div>
    )
}

export default VideoOpenToWatch