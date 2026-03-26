import React from "react";
import History from "./VideoHistory/History";

const HistoryPage = () => {
  return (
    <div className="h-full bg-background text-foreground">
      <div className="p-4 md:p-6">
        <History />
      </div>
    </div>
  );
};

export default HistoryPage;
