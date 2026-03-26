import { useState, useEffect } from "react";
import { user, ALL_VIDEOS } from "../pages/DataContent/Data";
import { MoreVertical, X, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

// ---------------------------
// INTERFACE
// ---------------------------
interface LikedItems {
  _id: string;
  videoid: string;
  liked_on: string;
  video: {
    _id: string;
    videotitle: string;
    videochanel: string;
    view: number;
    createdat: string;
    filepath: string;
  };
}

const LikeVideos = () => {
  const [likedVideos, setLikedVideos] = useState<LikedItems[]>([]);
  const [loading, setLoading] = useState(true);

  const AllUsers = user;

  // ---------------------------
  // LOAD DUMMY LIKED VIDEOS DATA
  // ---------------------------
  useEffect(() => {
    if (!AllUsers || AllUsers.length === 0) {
      setLoading(false);
      return;
    }

    // Map liked videos using ALL_VIDEOS data to get correct filepaths
    const LikedData: LikedItems[] = [
      {
        _id: "l1",
        videoid: "1",
        liked_on: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
        video: {
          _id: "1",
          videotitle:
            ALL_VIDEOS.find((v) => v._id === "1")?.videotitle ||
            "Amazing Nature Documentary",
          videochanel:
            ALL_VIDEOS.find((v) => v._id === "1")?.videochanel ||
            "Nature Channel",
          view: ALL_VIDEOS.find((v) => v._id === "1")?.views || 45000,
          filepath: ALL_VIDEOS.find((v) => v._id === "1")?.filepath || "",
          createdat:
            ALL_VIDEOS.find((v) => v._id === "1")?.createdAt ||
            new Date().toISOString(),
        },
      },
      {
        _id: "l2",
        videoid: "4",
        liked_on: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
        video: {
          _id: "4",
          videotitle:
            ALL_VIDEOS.find((v) => v._id === "4")?.videotitle ||
            "SouthIndies vs India",
          videochanel:
            ALL_VIDEOS.find((v) => v._id === "4")?.videochanel ||
            "Sport Highlights",
          view: ALL_VIDEOS.find((v) => v._id === "4")?.views || 350000,
          filepath: ALL_VIDEOS.find((v) => v._id === "4")?.filepath || "",
          createdat:
            ALL_VIDEOS.find((v) => v._id === "4")?.createdAt ||
            new Date(Date.now() - 604800000).toISOString(),
        },
      },
      {
        _id: "l3",
        videoid: "5",
        liked_on: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
        video: {
          _id: "5",
          videotitle:
            ALL_VIDEOS.find((v) => v._id === "5")?.videotitle ||
            "TriggerInsan's Latest VLOG",
          videochanel:
            ALL_VIDEOS.find((v) => v._id === "5")?.videochanel || "Trigger",
          view: ALL_VIDEOS.find((v) => v._id === "5")?.views || 25000,
          filepath: ALL_VIDEOS.find((v) => v._id === "5")?.filepath || "",
          createdat:
            ALL_VIDEOS.find((v) => v._id === "5")?.createdAt ||
            new Date(Date.now() - 1209600000).toISOString(),
        },
      },
    ];

    setLikedVideos(LikedData);
    setLoading(false);
  }, []);

  // ---------------------------
  // REMOVE FROM LIKED VIDEOS
  // ---------------------------
  const handleRemoveFromLiked = (likedId: string) => {
    setLikedVideos((prev) => prev.filter((item) => item._id !== likedId));
  };

  // ---------------------------
  // LOADING UI
  // ---------------------------
  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  // ---------------------------
  // NO USER FOUND
  // ---------------------------
  if (!AllUsers || AllUsers.length === 0) {
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
                <video
                  src={
                    item.video?.filepath ||
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  muted
                  playsInline
                  preload="metadata"
                  width={160}
                  height={90}
                  onError={(e) => {
                    e.currentTarget.poster =
                      "https://via.placeholder.com/160x90?text=No+Preview";
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
                {item.video.view.toLocaleString()} views •{" "}
                {formatDistanceToNow(new Date(item.video.createdat))} ago
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
