import { useState, useEffect } from "react";
import { user, ALL_VIDEOS } from "../pages/DataContent/Data";
import { MoreVertical, X, Clock } from "lucide-react";
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
interface WatchLaterItems {
  _id: string;
  videoid: string;
  saved_on: string;
  video: {
    _id: string;
    videotitle: string;
    videochanel: string;
    view: number;
    createdat: string;
    filepath: string;
  };
}

const WatchVideoLater = () => {
  const [watchLater, setWatchLater] = useState<WatchLaterItems[]>([]);
  const [loading, setLoading] = useState(true);

  const AllUsers = user;

  // ---------------------------
  // LOAD DUMMY WATCH LATER DATA
  // ---------------------------
  useEffect(() => {
    if (!AllUsers || AllUsers.length === 0) {
      setLoading(false);
      return;
    }

    // Map watch later items using ALL_VIDEOS data to get correct filepaths
    const WatchLaterData: WatchLaterItems[] = [
      {
        _id: "wl1",
        videoid: "2",
        saved_on: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), // 6 hours ago
        video: {
          _id: "2",
          videotitle:
            ALL_VIDEOS.find((v) => v._id === "2")?.videotitle ||
            "Cooking Tutorial: Perfect Pasta",
          videochanel:
            ALL_VIDEOS.find((v) => v._id === "2")?.videochanel ||
            "Chef's Kitchen",
          view: ALL_VIDEOS.find((v) => v._id === "2")?.views || 23000,
          filepath: ALL_VIDEOS.find((v) => v._id === "2")?.filepath || "",
          createdat:
            ALL_VIDEOS.find((v) => v._id === "2")?.createdAt ||
            new Date(Date.now() - 86400000).toISOString(),
        },
      },
      {
        _id: "wl2",
        videoid: "3",
        saved_on: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
        video: {
          _id: "3",
          videotitle:
            ALL_VIDEOS.find((v) => v._id === "3")?.videotitle ||
            "RenGoku vs Mussa",
          videochanel:
            ALL_VIDEOS.find((v) => v._id === "3")?.videochanel || "golu_yeager",
          view: ALL_VIDEOS.find((v) => v._id === "3")?.views || 25000,
          filepath: ALL_VIDEOS.find((v) => v._id === "3")?.filepath || "",
          createdat:
            ALL_VIDEOS.find((v) => v._id === "3")?.createdAt ||
            new Date(Date.now() - 172800000).toISOString(),
        },
      },
      {
        _id: "wl3",
        videoid: "6",
        saved_on: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
        video: {
          _id: "6",
          videotitle:
            ALL_VIDEOS.find((v) => v._id === "6")?.videotitle ||
            "Musa's Best Dance Moves",
          videochanel:
            ALL_VIDEOS.find((v) => v._id === "6")?.videochanel || "golu_yeager",
          view: ALL_VIDEOS.find((v) => v._id === "6")?.views || 10000,
          filepath: ALL_VIDEOS.find((v) => v._id === "6")?.filepath || "",
          createdat:
            ALL_VIDEOS.find((v) => v._id === "6")?.createdAt ||
            new Date(Date.now() - 2419200000).toISOString(),
        },
      },
    ];

    setWatchLater(WatchLaterData);
    setLoading(false);
  }, []);

  // ---------------------------
  // REMOVE FROM WATCH LATER
  // ---------------------------
  const handleRemoveFromWatchLater = (watchLaterId: string) => {
    setWatchLater((prev) => prev.filter((item) => item._id !== watchLaterId));
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
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Save videos to watch later
        </h2>
        <p className="text-gray-600">
          Watch later videos are not viewable when signed out.
        </p>
      </div>
    );
  }

  // ---------------------------
  // EMPTY WATCH LATER
  // ---------------------------
  if (watchLater.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No videos saved yet</h2>
        <p className="text-gray-600">
          Videos you save to watch later will appear here.
        </p>
      </div>
    );
  }

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{watchLater.length} videos</p>
      </div>

      <div className="space-y-4">
        {watchLater.map((item) => (
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
                Saved {formatDistanceToNow(new Date(item.saved_on))} ago
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
                  onClick={() => handleRemoveFromWatchLater(item._id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove from watch later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchVideoLater;
