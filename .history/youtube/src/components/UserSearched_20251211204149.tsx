"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_VIDEOS } from "@/pages/DataContent/Data";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserSearchedProps {
  query: string;
}

const UserSearched = ({ query }: UserSearchedProps) => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (!query) return;

    const filtered = ALL_VIDEOS.filter(
      (vid) =>
        vid.videotitle.toLowerCase().includes(query.toLowerCase()) ||
        vid.videochanel.toLowerCase().includes(query.toLowerCase())
    );

    setVideos(filtered);
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-12 text-gray-700">
        Start typing to search videos…
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-600">Try different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {videos.map((video) => (
        <div key={video._id} className="flex gap-4 group">
          <Link href={`/watch/${video._id}`} className="flex-shrink-0">
            <div className="relative w-80 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                src={video.filepath}
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>

          <div className="flex-1 min-w-0 py-1">
            <Link href={`/watch/${video._id}`}>
              <h3 className="font-medium text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
                {video.videotitle}
              </h3>
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>{video.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div>

            <Link
              href={`/channel/${video.videochanel}`}
              className="flex items-center gap-2 mb-2 hover:text-blue-600"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{video.videochanel[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">
                {video.videochanel}
              </span>
            </Link>

            <p className="text-sm text-gray-700 line-clamp-2">
              Sample video description shown for now…
            </p>
          </div>
        </div>
      ))}

      <div className="text-center py-8 text-gray-600">
        Showing {videos.length} results for "{query}"
      </div>
    </div>
  );
};

export default UserSearched;
