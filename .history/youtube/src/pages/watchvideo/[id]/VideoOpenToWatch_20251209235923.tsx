import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import VideoPlayer from "@/components/Videoplayer";
import { ALL_VIDEOS } from "../../DataContent/Data";
import ChannelInfo from "@/components/ChannelInfo";
import Comments from "@/components/Comments";

const VideoOpenToWatch = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  interface Video {
    _id: string;
    videotitle: string;
    videochanel: string;
    views: number;
    Like: number;
    filepath: string;
  }

  const [video, setVideo] = useState<Video | undefined>(undefined);

  const relatedVideos = ALL_VIDEOS;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const foundVideo = relatedVideos.find((v) => String(v._id) === String(id));

    setTimeout(() => {
      setLoading(false);
      setVideo(foundVideo);
    }, 0);
  }, [router.isReady, id, relatedVideos]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found for ID: {id}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 w-full">
          <VideoPlayer video={video} />
          <div className="flex items-center mt-2">
            <ChannelInfo />
            <Comments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoOpenToWatch;
