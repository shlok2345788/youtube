import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import VideoPlayer from '@/components/Videoplayer' // Import your VideoPlayer

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    // 🎯 FIX 1: Set loading to true initially until the router is ready
    const [loading, setLoading] = useState(true)
    const [video, setVideo] = useState<any>()

    const TEST_VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

    const relatedVideos = [
        { _id: "1", videotitle: "Amazing Nature Documentary", videochanel: "Nature Channel", views: 45000, Like: 1250, createdAt: new Date().toISOString(), filepath: TEST_VIDEO_URL, Dislike: 50, filename: "" },
        { _id: "2", videotitle: "Cooking Tutorial: Perfect Pasta", videochanel: "Chef's Kitchen", views: 23000, Like: 890, createdAt: new Date(Date.now() - 86400000).toISOString(), filepath: TEST_VIDEO_URL, Dislike: 20, filename: "" },
    ]

    // 👉 Load video based on ID
    useEffect(() => {
        // 🎯 FIX 2: Check if the router is ready (i.e., id is fully resolved)
        if (!router.isReady) {
            return;
        }

        const foundVideo = relatedVideos.find(v => v._id === String(id))
        setVideo(foundVideo)
        setLoading(false) // Set loading to false once we've attempted the lookup
    }, [router.isReady, id]) // Depend on both router.isReady and id

    // 👉 Show loading
    // This will run on initial render until isReady changes
    if (loading) {
        return <div>Loading...</div>
    }

    // 👉 If no video found (id resolved but no video matches)
    if (!video) {
        return <div>Video not found for ID: {id}</div>
    }

    // 👇 Execution is guaranteed to reach here only when 'video' is defined
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                <VideoPlayer video={video} />
                {/* Line 70 (approx) is now safe */}
                <h1 className="text-2xl font-bold mt-4">{video.videotitle}</h1>

                <div className="flex items-center gap-4 text-gray-600 mt-2">
                    <p>Channel: **{video.videochanel}**</p>
                    <p>Views: **{video.views.toLocaleString()}**</p>
                    <p>Likes: **{video.Like}**</p>
                </div>
            </div>
            {/* ... related videos component (optional) ... */}
        </div>
    )
}

export default VideoOpenToWatch