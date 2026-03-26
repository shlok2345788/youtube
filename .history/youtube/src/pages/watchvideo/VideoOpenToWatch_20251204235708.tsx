import { useState } from "react"
import React from 'react'
import { useRouter } from "next/router";

const VideoOpenToWatch = () => {
    const [loading, setloading] = useState(true);
    const [video, setvideo] = useState<any>()
    const router = useRouter();
    const { id } = router.query; {/* this will give info about each video , means watch/3 then the 3 is the id */}
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
    if(loading){
        return<>Loading.....</>
    }
    if(!loading){

    }
    return (
        <div></div>
    )
}

export default VideoOpenToWatch