import Navbar from "../components/ui/Navbar";
import React from "react";
import CategoryTabs from "@/components/CategoryTabs";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-row">

        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT SECTION */}
        <div className="flex-1 p-4">
          <CategoryTabs />

          {/* Add your cards / videos here later */}
          <div className="mt-4">
            {/* Video cards */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
