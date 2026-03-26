import Navbar from "../components/Navbar";
import React from "react";
import Sidebar from "@/components/Sidebar";
import History from "./VideoHistory/History";

const HistoryPage = () => {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <Navbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1">
          <History />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
