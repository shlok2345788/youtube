import React from 'react'
import { useRouter } from 'next/router'
import { useState , useEffect } from 'react'

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setloading] = useState(true)
    const [vidoe, setvidoe] = useState(second)
    return (
        <div>VideoOpenToWatch</div>
    )
}

export default VideoOpenToWatch