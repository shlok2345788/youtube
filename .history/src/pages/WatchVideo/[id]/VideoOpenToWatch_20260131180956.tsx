import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import data from "../../DataContent/data";
import ChannelInfo from "@/components/ChannelInfo";
import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideo";

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

  const relatedVideos = data.ALL_VIDEOS;

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
    <div className="container mx-auto  px-4 py-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 w-full">
          <div className="flex gap-6 justify-end">
            <CustomVideoPlayer 
              video={video} 
              onNextVideo={() => {
                // Find next video in the list
                const currentIndex = relatedVideos.findIndex((v: any) => v._id === video._id);
                const nextIndex = (currentIndex + 1) % relatedVideos.length;
                const nextVideo = relatedVideos[nextIndex];
                router.push(`/watch/${nextVideo._id}`);
              }}
              onCloseVideo={() => {
                // Navigate back to home or previous page
                router.back();
              }}
              onShowComments={() => {
                // Scroll to comments section
                document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <RelatedVideos videos={relatedVideos} />
          </div>
          <div className="items-center mt-3">
            <ChannelInfo />
            <Comments videoId={String(id || video?._id || "")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoOpenToWatch;
