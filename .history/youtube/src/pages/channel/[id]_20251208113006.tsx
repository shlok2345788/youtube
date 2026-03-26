import Navbar from "../../components/ui/Navbar";
import React from "react";
import Sidebar from "@/components/Sidebar";
import UserChannel from "./UserChannel";

const ChannelPage = () => {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <Navbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1">
          <UserChannel />
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;

