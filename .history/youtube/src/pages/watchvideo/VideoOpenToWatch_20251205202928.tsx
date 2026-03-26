import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import VideoPlayer from '@/components/Videoplayer'

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    const [loading, setLoading] = useState(true)
    const [video, setVideo] = useState(null)

    const TEST_VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

    // 🎯 FIX: This array must contain ALL videos that exist in your VideoGrid
    const relatedVideos = [
        {
            _id: "1",
            videotitle: "Amazing Nature Documentary",
            videochanel: "Nature Channel",
            views: 45000,
            Like: 1250,
            createdAt: new Date().toISOString(),
            filepath: TEST_VIDEO_URL,
            Dislike: 50
        },
        {
            _id: "2",
            videotitle: "Cooking Tutorial: Perfect Pasta",
            videochanel: "Chef's Kitchen",
            views: 23000,
            Like: 890,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL,
            Dislike: 20
        },
        // 👇 ADDED MISSING VIDEOS FROM GRID
        {
            _id: "3",
            videotitle: "RenGoku vs Mussa",
            videochanel: "golu_yeager",
            views: 25000,
            Like: 500, // Added dummy likes
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL,
            Dislike: 10
        },
        {
            _id: "4",
            videotitle: "SouthIndies vs India",
            videochanel: "golu_yeager",
            views: 25000,
            Like: 400,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL,
            Dislike: 5
        },
        {
            _id: "5",
            videotitle: "TriggerInsan",
            videochanel: "Trigger",
            views: 25000,
            Like: 900,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL,
            Dislike: 15
        },
        {
            _id: "6",
            videotitle: "RenGoku vs Mussa",
            videochanel: "golu_yeager",
            views: 25000,
            Like: 200,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL,
            Dislike: 2
        },
    ]

    useEffect(() => {
        if (!router.isReady) return;

        // Ensure we compare strings to strings
        const foundVideo = relatedVideos.find(v => String(v._id) === String(id))

        setVideo(foundVideo)
        setLoading(false)
    }, [router.isReady, id])

    if (loading) return <div>Loading...</div>

    if (!video) return <div>Video not found for ID: {id}</div>

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                <VideoPlayer video={video} />
                <h1 className="text-2xl font-bold mt-4">{video.videotitle}</h1>
                <div className="flex items-center gap-4 text-gray-600 mt-2">
                    <p>Channel: <strong>{video.videochanel}</strong></p>
                    <p>Views: <strong>{video.views?.toLocaleString()}</strong></p>
                    <p>Likes: <strong>{video.Like}</strong></p>
                </div>
            </div>
        </div>
    )
}

export default VideoOpenToWatch