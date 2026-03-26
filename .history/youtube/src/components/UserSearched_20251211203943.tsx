"use client";

import { useEffect, useState } from "react";
import { ALL_VIDEOS } from "@/pages/DataContent/Data";

export default function UserSearched({ query }: { query: string }) {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredVideos([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const results = ALL_VIDEOS.filter((v) =>
        v.videotitle.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredVideos(results);
      setLoading(false);
    }, 300);
  }, [query]);

  if (loading) return <p>Loading...</p>;

  if (!filteredVideos.length)
    return <p>No videos found for "{query}"</p>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {filteredVideos.map((video) => (
        <div
          key={video._id}
          className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">{video.videotitle}</h2>
          <p className="text-sm text-gray-700">{video.videochanel}</p>
        </div>
      ))}
    </div>
  );
}
