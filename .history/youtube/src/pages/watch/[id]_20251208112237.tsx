import Navbar from "../../components/ui/Navbar";
import React from "react";
import Sidebar from "@/components/Sidebar";
import VideoOpenToWatch from "../WatchVideo/[id]/VideoOpenToWatch";

const WatchPage = () => {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <Navbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1">
          <VideoOpenToWatch />
        </div>
      </div>
    </div>
  );
};

export default WatchPage;



