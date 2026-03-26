import { useState } from "react"
import React from 'react'
import { useRouter } from "next/router";

const VideoOpenToWatch = () => {
    const [loading, setloading] = useState(false);
    const [video, setvideo] = useState<any>()
    const router = useRouter();
    const { id } = router.query; {/* this will give info about each video , means watch/3 then the 3 is the id */ }
    const relatedVideos = [
        {
            _id: "1",
            videotitle: "Amazing Nature Documentary",
            filename: "nature-doc.mp4",
            filetype: "video/mp4",
            filepath: "/videos/nature-doc.mp4",
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
            filepath: "/videos/pasta-tutorial.mp4",
            filesize: "300MB",
            videochanel: "Chef's Kitchen",
            Like: 890,
            Dislike: 20,
            views: 23000,
            uploader: "chef_master",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            _id: "3",
            videotitle: "SouthIndies vs India",
            filename: "fight.mp4",
            filepath: "/videos/fight.mp4",
            filesize: "300MB",
            videochanel: "golu_yeager",
            views: 25000,
            Like: 8900,
            Dislike: 200,
            uploader: "golu_yeager",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            _id: "3",
            videotitle: "TriggerInsan",
            filename: "fight.mp4",
            filepath: "/videos/fight.mp4",
            filesize: "300MB",
            videochanel: "Trigger",
            views: 25000,
            Like: 90,
            Dislike: 20,
            uploader: "TriggerInsan",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
    ];
    if (loading) {
        return <div className="text-black">Loading.....</div>
    }
    if (!video) {
        return <div className="text-black">Video not found!!</div>
    }
    return (
        <div>
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <Videopplayer video={videos} />
                            <VideoInfo video={videos} />
                            <Comments videoId={id} />
                        </div>
                        <div className="space-y-4">
                            <RelatedVideos videos={video} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoOpenToWatch