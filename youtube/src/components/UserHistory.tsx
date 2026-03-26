import { ALL_VIDEOS } from "../lib/data/videos";
import { MoreVertical, X, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const UserHistory = () => {
  const { user, login } = useUser();

  const handleRemoveFromHistory = async (videoId: string) => {
    if (!user) return;
    try {
      const res = await axiosInstance.post("/user/user/data", {
        userId: user._id || user.id,
        type: "history",
        action: "remove",
        videoId
      });
      if (res.data.user) {
        login(res.data.user);
      }
    } catch(e) {
      console.error("Failed to remove history", e);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Keep track of what you watch
        </h2>
        <p className="text-muted-foreground">
          Watch history is not viewable when signed out.
        </p>
      </div>
    );
  }

  const historyRaw: any[] = user?.history || [];
  const history = historyRaw.map(h => {
    const v = ALL_VIDEOS.find(vid => String(vid._id) === String(h.videoId));
    return {
      _id: h.videoId,
      videoid: h.videoId,
      watched_on: h.watchedAt,
      video: v || ALL_VIDEOS[0]
    };
  }).reverse(); // Most recent first

  // ---------------------------
  // EMPTY HISTORY
  // ---------------------------
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No watch history yet</h2>
        <p className="text-muted-foreground">Videos you watch will appear here.</p>
      </div>
    );
  }

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{history.length} videos</p>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div key={item._id} className="flex gap-4 group">
            {/* Video Thumbnail */}
            <Link href={`/watch/${item.video._id}`}>
              <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden shrink-0">
                {/* Sometimes src may be undefined or invalid, fallback to a sample video for testing */}
                <img
                  src={(item.video as any)?.thumbnailUrl || ALL_VIDEOS.find(v => v._id === item.video._id)?.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&q=80"}
                  alt={item.video.videotitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  width={160}
                  height={90}
                  onError={e => {
                    e.currentTarget.src = "https://via.placeholder.com/160x90?text=No+Thumbnail";
                  }}
                />
              </div>
            </Link>

            {/* Video Information */}
            <div className="flex-1 min-w-0">
              <Link href={`/watch/${item.video._id}`}>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                  {item.video.videotitle}
                </h3>
              </Link>

              <p className="text-sm text-muted-foreground">{item.video.videochanel}</p>

              <p className="text-sm text-muted-foreground">
                {item.video.views.toLocaleString()} views •{" "}
                {formatDistanceToNow(new Date(item.video.createdAt))} ago
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Watched {formatDistanceToNow(new Date(item.watched_on))} ago
              </p>
            </div>

            {/* Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleRemoveFromHistory(item._id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove from watch history
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;
