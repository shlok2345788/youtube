import Navbar from "../components/ui/Navbar";
import React from "react";
import CategoryTabs from "@/components/CategoryTabs";
import Sidebar from "@/components/Sidebar";
import VideoGrid from "@/components/VideoGrid";
import VideoOpenToWatch from "./watchvideo/VideoOpenToWatch";
import VideoCard from "@/components/VideoCard";

const Index = () => {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <Navbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1 p-4">
          <CategoryTabs />

          <div className="mt-4">
            <VideoGrid /> 
            <VideoCard />
            {/* <VideoOpenToWatch />   */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
