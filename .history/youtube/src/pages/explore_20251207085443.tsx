import Navbar from "../components/ui/Navbar";
import React from "react";
import Sidebar from "@/components/Sidebar";
import CategoryTabs from "@/components/CategoryTabs";
import VideoGrid from "@/components/VideoGrid";

const ExplorePage = () => {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <Navbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1 p-4">
          <CategoryTabs />

          <div className="mt-4">
            <VideoGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;


