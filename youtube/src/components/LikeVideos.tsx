import { ALL_VIDEOS } from "../lib/data/videos";
import { MoreVertical, X, ThumbsUp } from "lucide-react";
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

const LikeVideos = () => {
  const { user, login } = useUser();

  const handleRemoveFromLiked = async (videoId: string) => {
    if (!user) return;
    try {
      const res = await axiosInstance.post("/user/user/data", {
        userId: user._id || user.id,
        type: "liked",
        action: "remove",
        videoId
      });
      if (res.data.user) {
        login(res.data.user);
      }
    } catch(e) {
      console.error("Failed to remove liked video", e);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <ThumbsUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Keep track of videos you like
        </h2>
        <p className="text-gray-600">
          Liked videos are not viewable when signed out.
        </p>
      </div>
    );
  }

  const likedRaw: any[] = user?.likedVideos || [];
  const likedVideos = likedRaw.map(h => {
    const v = ALL_VIDEOS.find(vid => String(vid._id) === String(h.videoId));
    return {
      _id: h.videoId,
      videoid: h.videoId,
      liked_on: h.likedAt,
      video: v || ALL_VIDEOS[0]
    };
  }).reverse();

  // ---------------------------
  // EMPTY LIKED VIDEOS
  // ---------------------------
  if (likedVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <ThumbsUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No liked videos yet</h2>
        <p className="text-gray-600">Videos you like will appear here.</p>
      </div>
    );
  }

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{likedVideos.length} videos</p>
      </div>

      <div className="space-y-4">
        {likedVideos.map((item) => (
          <div key={item._id} className="flex gap-4 group">
            {/* Video Thumbnail */}
            <Link href={`/watch/${item.video._id}`}>
              <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden shrink-0">
                <img
                  src={(item.video as any)?.thumbnailUrl || ALL_VIDEOS.find(v => v._id === item.video._id)?.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&q=80"}
                  alt={item.video.videotitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  width={160}
                  height={90}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/160x90?text=No+Thumbnail";
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

              <p className="text-sm text-gray-600">{item.video.videochanel}</p>

              <p className="text-sm text-gray-600">
                {item.video.views.toLocaleString()} views •{" "}
                {formatDistanceToNow(new Date(item.video.createdAt))} ago
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Liked {formatDistanceToNow(new Date(item.liked_on))} ago
              </p>
            </div>

            {/* Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleRemoveFromLiked(item._id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove from liked videos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikeVideos;
