import Navbar from "../components/ui/Navbar";
import React from "react";
import Sidebar from "@/components/Sidebar";

const SubscriptionsPage = () => {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <Navbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
            <p className="text-gray-600">Your subscribed channels will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;


