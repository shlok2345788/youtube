import React from "react";
import CategoryTabs from "@/components/CategoryTabs";
import VideoGrid from "@/components/VideoGrid";

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-2">
        <CategoryTabs />

        <div className="mt-2">
          <VideoGrid />
        </div>
      </div>
    </div>

  );
};

export default ExplorePage;
