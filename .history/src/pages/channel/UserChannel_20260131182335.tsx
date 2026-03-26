import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChannelHeader from "@/components/ChannelHeader";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import ChannelTabs from "@/components/ChannelTabs";
import Comments from "@/components/Comments";
import data from "@/lib/data/videos";

const UserChannel = () => {
  const router = useRouter();
  const { id } = router.query;
  const [channel, setChannel] = useState<{ _id: string; username: string; email: string } | null>(null);
  const [channelVideos, setChannelVideos] = useState<any[]>([]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Find the channel/user by ID from route params, or use first user as default
    const channelId = id ? String(id) : "1";
    const foundUserData = data.user.find((u) => u.id === channelId) || data.user[0];
    const transformedChannel = {
      _id: foundUserData.id,
      username: foundUserData.username,
      email: foundUserData.email
    };
    setChannel(transformedChannel);

    // Filter videos by channel name (matching videochanel field)
    if (transformedChannel) {
      const videos = data.ALL_VIDEOS.filter(
        (video) => video.videochanel === transformedChannel.username
      );
      setChannelVideos(videos);
    }
  }, [router.isReady, id]);

  if (!channel) {
    return (
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading channel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-white">
      <div className="max-w-full mx-auto">
        <ChannelHeader
          channel={channel}
          user={data.user.map(u => ({ _id: u.id, username: u.username }))}
        />
        <ChannelTabs />
        <div className="px-4 pb-8">
          <VideoUploader
            channelId={channel._id}
            channelName={channel.username}
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
