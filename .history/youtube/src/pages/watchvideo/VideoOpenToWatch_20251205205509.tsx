import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import VideoPlayer from '@/components/Videoplayer'
// 🟢 IMPORT THE SHARED DATA
import { ALL_VIDEOS } from '../';

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    const [loading, setLoading] = useState(true)
    const [video, setVideo] = useState()

    // ❌ REMOVED: const TEST_VIDEO_URL = ...
    // ❌ REMOVED: const relatedVideos = [...] (The hardcoded array)

    // 🟢 Use the imported array as the source
    const relatedVideos = ALL_VIDEOS;

    // 👉 Load video based on ID
    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        // 🟢 Now this search is against all 6 videos
        const foundVideo = relatedVideos.find(v => String(v._id) === String(id))

        setVideo(foundVideo)
        setLoading(false)
    }, [router.isReady, id])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!video) {
        return <div>Video not found for ID: {id}</div>
    }

    // 👇 The rest of your return block is now safe
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                <VideoPlayer video={video} />
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