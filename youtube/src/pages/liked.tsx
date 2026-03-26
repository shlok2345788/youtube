import React from "react";
import Like from "./VideoLikes/Like";

const LikedPage = () => {
  return (
    <div className="h-full bg-background text-foreground">
      <div className="p-4 md:p-6">
        <Like />
      </div>
    </div>
  );
};

export default LikedPage;
