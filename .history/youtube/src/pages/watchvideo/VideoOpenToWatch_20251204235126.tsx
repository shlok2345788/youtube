import React from 'react'

const VideoOpenToWatch = () => {
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
            videochanel: "golu_yeager",
            views: 25000,
            Like: 890,
            Dislike: 20,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            _id: "3",
            videotitle: "TriggerInsan",
            filename: "fight.mp4",
            filepath: "/videos/fight.mp4",
            videochanel: "Trigger",
            views: 25000,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
    ];
    return (
        <div></div>
    )
}

export default VideoOpenToWatch