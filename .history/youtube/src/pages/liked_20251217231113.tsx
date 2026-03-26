import React from "react";
import Like from "./VideoLikes/Like";

const LikedPage = () => {
  return (
    <div className="h-full bg-white text-black">
      <div className="p-4">
        <Like />
      </div>
    </div>
  );
};

export default LikedPage;
