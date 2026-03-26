import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChannelHeader from "@/components/ChannelHeader";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import ChannelTabs from "@/components/ChannelTabs";
import Comments from "@/components/Comments";
import { user, ALL_VIDEOS } from "@/lib/data/videos";
import DownloadsPage from "@/pages/downloads/index";
import { useUser } from "@/lib/AuthContext";

const UserChannel = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser } = useUser();
  const [channel, setChannel] = useState<(typeof user)[0] | null>(null);
  const [channelVideos, setChannelVideos] = useState<any[]>([]);
  const [selectedtab, setselectedtab] = useState<string>("home");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Find the channel/user by ID from route params, or use first user as default
    const channelId = id ? String(id) : "1";
    const foundChannel = user.find((u) => u.id === channelId) || user[0];
    setChannel(foundChannel);

    // Filter videos by channel name (matching videochanel field)
    if (foundChannel) {
      const videos = ALL_VIDEOS.filter(
        (video) => video.videochanel === foundChannel.username
      );
      setChannelVideos(videos);
    }
  }, [router.isReady, id]);

  if (!channel) {
    return (
      <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading channel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-background text-foreground">
      <div className="max-w-full mx-auto">
        <ChannelHeader channel={channel} user={user[0]} />
        <ChannelTabs selectedtab={selectedtab} setselectedtab={setselectedtab} />
        
        {selectedtab === "home" && (
          <>
            <div className="px-4 pb-8">
              <VideoUploader
                channelId={channel.id}
                channelName={channel.username}
              />
            </div>
            <div className="px-4 pb-8">
              <ChannelVideos videos={channelVideos} />
            </div>
          </>
        )}

        {selectedtab === "downloads" && currentUser?.id === channel.id && (
          <div className="px-0 pb-8">
            <DownloadsPage />
          </div>
        )}
        
        {selectedtab === "downloads" && currentUser?.id !== channel.id && (
          <div className="px-4 pb-8 pt-12 text-center text-gray-500 font-medium">
            This tab is private.
          </div>
        )}

      </div>
    </div>
  );
};

export default UserChannel;
