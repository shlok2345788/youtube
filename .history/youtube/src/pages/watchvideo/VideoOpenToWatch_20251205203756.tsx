import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import VideoPlayer from '@/components/Videoplayer' 

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    const [loading, setLoading] = useState(true)
    const [video, setVideo] = useState(null)

    const TEST_VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

    // 🎯 FIX: I have added ALL 6 videos here and added the 'Like' property to them
    const relatedVideos = [
        { 
            _id: "1", 
            videotitle: "Amazing Nature Documentary", 
            videochanel: "Nature Channel", 
            views: 45000, 
            Like: 1250, 
            createdAt: new Date().toISOString(), 
            filepath: TEST_VIDEO_URL 
        },
        { 
            _id: "2", 
            videotitle: "Cooking Tutorial: Perfect Pasta", 
            videochanel: "Chef's Kitchen", 
            views: 23000, 
            Like: 890, 
            createdAt: new Date(Date.now() - 86400000).toISOString(), 
            filepath: TEST_VIDEO_URL 
        },
        {
            _id: "3",
            videotitle: "RenGoku vs Mussa",
            videochanel: "golu_yeager",
            views: 25000,
            Like: 430, // Added missing Like
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL
        },
        {
            _id: "4",
            videotitle: "SouthIndies vs India",
            videochanel: "golu_yeager",
            views: 25000,
            Like: 210, // Added missing Like
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL
        },
        {
            _id: "5",
            videotitle: "TriggerInsan",
            videochanel: "Trigger",
            views: 25000,
            Like: 900, // Added missing Like
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL
        },
        {
            _id: "6",
            videotitle: "RenGoku vs Mussa",
            videochanel: "golu_yeager",
            views: 25000,
            Like: 120, // Added missing Like
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filepath: TEST_VIDEO_URL
        },
    ]

    useEffect(() => {
        if (!router.isReady) return;

        // 🔍 Log the ID to see what is coming from the URL
        console.log("Searching for ID:", id);

        // Ensure both are strings for comparison
        const foundVideo = relatedVideos.find(v => String(v._id) === String(id))

        console.log("Video found:", foundVideo); // This will show you if it found anything

        setVideo(foundVideo)
        setLoading(false)
    }, [router.isReady, id])

    if (loading) return <div>Loading...</div>

    // Safety check: if video is null, stop here.
    if (!video) return <div>Video not found for ID: {id}</div>

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                <VideoPlayer video={video} />
                
                {/* Use Optional Chaining (?.) just in case a property is missing */}
                <h1 className="text-2xl font-bold mt-4">{video?.videotitle}</h1>

                <div className="flex items-center gap-4 text-gray-600 mt-2">
                    {/* Access properties safely */}
                    <p>Channel: <strong>{video?.videochanel}</strong></p>
                    
                    {/* Add fallback for views in case it is undefined */}
                    <p>Views: <strong>{video?.views ? video.views.toLocaleString() : 0}</strong></p>
                    
                    <p>Likes: <strong>{video?.Like || 0}</strong></p>
                </div>
            </div>
            {/* ... related videos component ... */}
        </div>
    )
}

export default VideoOpenToWatch