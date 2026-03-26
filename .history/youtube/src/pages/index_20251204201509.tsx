import Navbar from "../components/ui/Navbar";
import React from "react";
import CategoryTabs from "@/components/CategoryTabs";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-row">

        <Sidebar />

        <div className="flex-1 p-4">
          <CategoryTabs />

          <div className="mt-4">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
