import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const VideoOpenToWatch = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<any>(null);

  const relatedVideos = [
    {
      _id: "1",
      videotitle: "Amazing Nature Documentary",
      filepath: "https://www.pexels.com/download/video/35002097/",
      views: 45000,
    },
    {
      _id: "2",
      videotitle: "Perfect Pasta Tutorial",
      filepath: "https://www.pexels.com/download/video/35002097/",
      views: 23000,
    },
  ];

  useEffect(() => {
    if (!router.isReady) return;  // ❗ Wait until router query is available

    const { id } = router.query;

    const foundVideo = relatedVideos.find((v) => v._id === String(id));

    setVideo(foundVideo || null);
    setLoading(false);
  }, [router.isReady, router.query]);

  // 👉 Correct loading return
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div>
      <h1>{video.videotitle}</h1>
      <video src={video.filepath} controls width="500" />
      <p>Views: {video.views}</p>
    </div>
  );
};

export default VideoOpenToWatch;
