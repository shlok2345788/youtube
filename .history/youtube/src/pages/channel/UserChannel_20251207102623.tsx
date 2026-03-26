import ChannelHeader from "@/components/ChannelHeader";
import ChannelVideos from "@/components/ChannelVideos";
import React from "react";
import { user } from "../DataContent/Data";

const UserChannel = () => {
  const channel = user;
  return (
    <div className="flex-1 min-h-screen bg-white">
    <div className="max-w-full mx-auto">
      <ChannelHeader channel={channel} user={user} />
      <Channeltabs />
      <div className="px-4 pb-8">
        <VideoUploader channelId={id} channelName={channel?.channelname} />
      </div>
      <div className="px-4 pb-8">
        <ChannelVideos videos={videos} />
      </div>
    </div>
  </div>
  );
};

export default UserChannel;
