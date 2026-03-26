import Navbar from "../components/ui/Navbar";
import React from "react";
import CategoryTabs from "@/components/CategoryTabs";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";

const Index = () => {
  return (
    <div className="h-full bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-row">

        <Sidebar />

        <div className="flex-1 p-4">
          <CategoryTabs />

          <div className="mt-4">
            <VideoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
