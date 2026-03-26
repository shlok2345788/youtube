import React from "react";
import CategoryTabs from "@/components/CategoryTabs";
import VideoGrid from "@/components/VideoGrid";

const ExplorePage = () => {
  return (
    <div className="h-full bg-white text-black">
      <div className="p-4">
        <CategoryTabs />

        <div className="mt-4">
          <VideoGrid />
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
