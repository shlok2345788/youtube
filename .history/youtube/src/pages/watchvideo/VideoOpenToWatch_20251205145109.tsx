import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    const [loading, setLoading] = useState(false)
    const [video, setVideo] = useState<any>(null)

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
    ]

    // 👉 Load video based on ID
    useEffect(() => {
        if (!id) return; // router not ready

        const foundVideo = relatedVideos.find(v => v._id === String(id))
        setVideo(foundVideo)
        setLoading(false)
    }, [id])

    // 👉 Show loading
    if (loading) {
        return <div>Loading...</div>
    }

    // 👉 If no video found
    if (!video) {
        return <div>Video not found</div>
    }

    return (
        <div>
            <h1>{video.videotitle}</h1>

            <video 
                src={video.filepath} 
                controls 
                width="500"
            />

            <p>Views: {video.views}</p>
            <p>Likes: {video.Like}</p>
            <p>Channel: {video.videochanel}</p>
        </div>
    )
}

export default VideoOpenToWatch
