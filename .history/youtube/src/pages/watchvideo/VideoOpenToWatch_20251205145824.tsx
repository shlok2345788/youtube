import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import VideoPlayer from '@/components/Videoplayer'// Assuming VideoPlayer is imported

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    const [loading, setLoading] = useState(false)
    const [video, setVideo] = useState<any>()

    // 🛑 CORRECTED: Replaced the download links with a direct MP4 streaming link
    const TEST_VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 

    const relatedVideos = [
        {
            _id: "1",
            videotitle: "Amazing Nature Documentary (Now Playing!)",
            filename: "nature-doc.mp4",
            filetype: "video/mp4",
            filepath: TEST_VIDEO_URL, // 🎯 FIXED
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
            filepath: TEST_VIDEO_URL, // 🎯 FIXED
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
        // Set loading true when ID changes to show loader before finding video
        if (id) {
            setLoading(true); 
            const foundVideo = relatedVideos.find(v => v._id === String(id))
            setVideo(foundVideo)
            setLoading(false)
        }
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
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                {/* Using VideoPlayer component */}
                <VideoPlayer video={video} /> 

                <h1 className="text-2xl font-bold mt-4">{video.videotitle}</h1>

                <div className="flex items-center gap-4 text-gray-600 mt-2">
                    <p>Channel: **{video.videochanel}**</p>
                    <p>Views: **{video.views.toLocaleString()}**</p>
                    <p>Likes: **{video.Like}**</p>
                </div>
            </div>
            {/* You would typically render related videos here */}
            <div className="w-full lg:w-80">
                <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
                {relatedVideos.filter(v => v._id !== video._id).map(v => (
                     // Placeholder for a smaller related video card
                     <div key={v._id} className="mb-3 p-2 border rounded">
                        <p className="font-medium text-sm">{v.videotitle}</p>
                        <p className="text-xs text-gray-500">{v.videochanel}</p>
                     </div>
                ))}
            </div>
        </div>
    )
}

export default VideoOpenToWatch