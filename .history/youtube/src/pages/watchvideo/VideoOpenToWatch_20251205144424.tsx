import React from 'react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setloading] = useState(true)
    const [video, setvideo] = useState<any>()

    const relatedVideos = [
        {
            _id: "1",
            videotitle: "Amazing Nature Documentary",
            filename: "nature-doc.mp4",
            filetype: "video/mp4",
            filepath: "https://www.pexels.com/download/video/35002097/",
            filesize: "500MB",
            videochanel: "Nature Channel",
            Like: 1250,
            Dislike: 50,
            views: 45000,
            uploader: "nature_lover",
            createdAt: new Date().toISOString(),
        },
        {
            _id: "2",
            videotitle: "Cooking Tutorial: Perfect Pasta",
            filename: "pasta-tutorial.mp4",
            filetype: "video/mp4",
            filepath: "https://www.pexels.com/download/video/35002097/",
            filesize: "300MB",
            videochanel: "Chef's Kitchen",
            Like: 890,
            Dislike: 20,
            views: 23000,
            uploader: "chef_master",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
    ];
    if (loading) {
        <div>Loading...</div>
    }
    if (!videos) {
        return <div>Video not found</div>;
    }
    return (
        <div></div>
    )
}

export default VideoOpenToWatch