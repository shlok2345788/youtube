import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import VideoPlayer from '@/components/Videoplayer'
// 🟢 IMPORT THE SHARED DATA
import { ALL_VIDEOS } from '../DataContent/Data';

const VideoOpenToWatch = () => {
    const router = useRouter()
    const { id } = router.query

    const [loading, setLoading] = useState(true)
    interface Video {
        _id: string;
        videotitle: string;
        videochanel: string;
        views: number;
        Like: number;
        filepath: string;  
    }
    
    const [video, setVideo] = useState<Video | undefined>(undefined)


    const relatedVideos = ALL_VIDEOS;

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        const foundVideo = relatedVideos.find(v => String(v._id) === String(id))

        // Use a callback to set the state after the effect
        setTimeout(() => {
            setLoading(false);
            setVideo(foundVideo);
        }, 0);
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