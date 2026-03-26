import React from 'react'
import { useRouter } from 'next/router'


const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <div>VideoOpenToWatch</div>
    )
}

export default VideoOpenToWatch