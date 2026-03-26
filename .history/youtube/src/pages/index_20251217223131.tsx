import Navbar from "../components/Navbar";
import React from "react";
import CategoryTabs from "@/components/CategoryTabs";
import Sidebar from "@/components/Sidebar";
import VideoGrid from "@/components/VideoGrid";

const Index = () => {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      {/* <Navbar /> */}

      <div className="flex flex-row">
        {/* <Sidebar /> */}

        <div className="flex-1 p-4">
          {/* <CategoryTabs /> */}

          <div className="mt-4">
            {/* <VideoGrid /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
