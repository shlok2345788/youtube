import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChannelHeader from "@/components/ChannelHeader";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import ChannelTabs from "@/components/ChannelTabs";
import { user, ALL_VIDEOS } from "../DataContent/Data";

type Video = {
  id: string;
  title: string;
  videochanel: string;
};

const UserChannel = () => {
  const router = useRouter();
  const { id } = router.query;
  const [channelState, setChannelState] = useState<{
    channel: (typeof user)[0] | null;
    channelVideos: any[];
  }>({
    channel: null,
    channelVideos: [],
  });

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Find the channel/user by ID from route params, or use first user as default
    const channelId = id ? String(id) : "1";
    const foundChannel = user.find((u) => u.id === channelId) || user[0];

    // Filter videos by channel name (matching videochanel field)
    const videos = foundChannel
      ? ALL_VIDEOS.filter(
          (video) => video.videochanel === foundChannel.username
        )
      : [];

    setChannelState({
      channel: foundChannel,
      channelVideos: videos,
    });
  }, [router.isReady, id]);

  if (!channelState.channel) {
    return (
  return (
    <div className="flex-1 min-h-screen bg-white">
      <div className="max-w-full mx-auto">
        <ChannelHeader channel={channelState.channel} user={user} />
        <ChannelTabs />
        <div className="px-4 pb-8">
          <VideoUploader
            channelId={channelState.channel.id}
            channelName={channelState.channel.username}
          />
        </div>
        <div className="px-4 pb-8">
          <ChannelVideos videos={channelState.channelVideos} />
        </div>
      </div>
    </div>
  );
          />
        </div>
        <div className="px-4 pb-8">
          <ChannelVideos videos={channelVideos} />
        </div>
      </div>
    </div>
  );
};

export default UserChannel;
