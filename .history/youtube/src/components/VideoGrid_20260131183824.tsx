import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
// 🟢 IMPORT THE SHARED DATA
import data from '@/lib/data/videos';

const VideoGrid = () => {
  const [loading, setLoading] = useState(true);

  // ❌ REMOVED: const TEST_VIDEO_URL = ... 
  // ❌ REMOVED: const videos = [...] (The hardcoded array)

  // 🟢 Use the imported array
  const videos = data.ALL_VIDEOS;

  useEffect(() => {
    // In a real app, this is where you'd fetch data.
    // Since we're using static data, we just set loading to false after a delay.
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? "Loading..."
        : videos.map((v) => <VideoCard key={v._id} video={v} />)}
    </div>
  );
};
export default VideoGrid;