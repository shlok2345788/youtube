import React from "react";
import { ALL_VIDEOS } from "@/pages/DataContent/Data";

const UserSearched = ({ query }: { query: string }) => {
  const results = VideosData.filter((item) =>
    item.videotitle.toLowerCase().includes(query.toLowerCase())
  );

  if (!query) return <div className="p-4">Type something to search...</div>;

  if (results.length === 0)
    return <div className="p-4">No results found for "{query}"</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Search Results:</h2>
      {results.map((video) => (
        <div key={video._id} className="border p-3 rounded-lg mb-2">
          <p className="font-medium">{video.videotitle}</p>
          <p className="text-sm text-gray-600">{video.views} views</p>
        </div>
      ))}
    </div>
  );
};

export default UserSearched;
