import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
// 🟢 IMPORT THE SHARED DATA
import { ALL_VIDEOS } from '@/lib/data/videos';

const VideoGrid = () => {
  const [loading, setLoading] = useState(true);

  // 🟢 Use the named export
  const videos = ALL_VIDEOS;

  useEffect(() => {
    // In a real app, this is where you'd fetch data.
    // Since we're using static data, we just set loading to false after a delay.
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-4 gap-y-10 px-4">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-video bg-secondary animate-pulse rounded-xl" />
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-secondary animate-pulse rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        : videos.map((v) => <VideoCard key={v._id} video={v} />)}
    </div>
  );
};
export default VideoGrid;