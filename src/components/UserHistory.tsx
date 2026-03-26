import { useState, useEffect } from "react";
import data from "@/lib/data/videos";
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
interface HistoryItems {
  _id: string;
  videoid: string;
  watched_on: string;
  video: {
    _id: string;
    videotitle: string;
    videochanel: string;
    view: number;
    createdat: string;
    filepath: string;
  };
}

const UserHistory = () => {
  const [history, setHistory] = useState<HistoryItems[]>([]);
  const [loading, setLoading] = useState(true);

  const AllUsers = data.user;

  // ---------------------------
  // LOAD DUMMY HISTORY DATA
  // ---------------------------
  useEffect(() => {
    if (!AllUsers || AllUsers.length === 0) {
      setLoading(false);
      return;
    }

    // Map history items using ALL_VIDEOS data to get correct filepaths
    const HistoryData: HistoryItems[] = [
      {
        _id: "h1",
        videoid: "1",
        watched_on: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
        video: {
          _id: "1",
          videotitle:
            data.ALL_VIDEOS.find((v) => v._id === "1")?.videotitle ||
            "Amazing Nature Documentary",
          videochanel:
            data.ALL_VIDEOS.find((v) => v._id === "1")?.videochanel ||
            "Nature Channel",
          view: data.ALL_VIDEOS.find((v) => v._id === "1")?.views || 45000,
          filepath: data.ALL_VIDEOS.find((v) => v._id === "1")?.filepath || "",
          createdat:
            data.ALL_VIDEOS.find((v) => v._id === "1")?.createdAt ||
            new Date().toISOString(),
        },
      },
      {
        _id: "h2",
        videoid: "2",
        watched_on: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago
        video: {
          _id: "2",
          videotitle:
            data.ALL_VIDEOS.find((v) => v._id === "2")?.videotitle ||
            "Cooking Tutorial: Perfect Pasta",
          videochanel:
            data.ALL_VIDEOS.find((v) => v._id === "2")?.videochanel ||
            "Chef's Kitchen",
          view: data.ALL_VIDEOS.find((v) => v._id === "2")?.views || 23000,
          filepath: data.ALL_VIDEOS.find((v) => v._id === "2")?.filepath || "",
          createdat:
            data.ALL_VIDEOS.find((v) => v._id === "2")?.createdAt ||
            new Date(Date.now() - 86400000).toISOString(),
        },
      },
      {
        _id: "h3",
        videoid: "3",
        watched_on: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
        video: {
          _id: "3",
          videotitle:
            data.ALL_VIDEOS.find((v) => v._id === "3")?.videotitle ||
            "RenGoku vs Mussa",
          videochanel:
            data.ALL_VIDEOS.find((v) => v._id === "3")?.videochanel || "golu_yeager",
          view: data.ALL_VIDEOS.find((v) => v._id === "3")?.views || 25000,
          filepath: data.ALL_VIDEOS.find((v) => v._id === "3")?.filepath || "",
          createdat:
            data.ALL_VIDEOS.find((v) => v._id === "3")?.createdAt ||
            new Date(Date.now() - 172800000).toISOString(),
        },
      },
      {
        _id: "h4",
        videoid: "4",
        watched_on: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
        video: {
          _id: "4",
          videotitle:
            data.ALL_VIDEOS.find((v) => v._id === "4")?.videotitle ||
            "SouthIndies vs India",
          videochanel:
            data.ALL_VIDEOS.find((v) => v._id === "4")?.videochanel ||
            "Sport Highlights",
          view: data.ALL_VIDEOS.find((v) => v._id === "4")?.views || 350000,
          filepath: data.ALL_VIDEOS.find((v) => v._id === "4")?.filepath || "",
          createdat:
            data.ALL_VIDEOS.find((v) => v._id === "4")?.createdAt ||
            new Date(Date.now() - 604800000).toISOString(),
        },
      },
    ];

    setHistory(HistoryData);
    setLoading(false);
  }, []);

  // ---------------------------
  // REMOVE FROM HISTORY
  // ---------------------------
  const handleRemoveFromHistory = (historyId: string) => {
    setHistory((prev) => prev.filter((item) => item._id !== historyId));
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
          Keep track of what you watch
        </h2>
        <p className="text-gray-600">
          Watch history is not viewable when signed out.
        </p>
      </div>
    );
  }

  // ---------------------------
  // EMPTY HISTORY
  // ---------------------------
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No watch history yet</h2>
        <p className="text-gray-600">Videos you watch will appear here.</p>
      </div>
    );
  }

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{history.length} videos</p>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div key={item._id} className="flex gap-4 group">
            {/* Video Thumbnail */}
            <Link href={`/watch/${item.video._id}`}>
              <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden shrink-0">
                {/* Sometimes src may be undefined or invalid, fallback to a sample video for testing */}
                <video
                  src={item.video?.filepath || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  muted
                  playsInline
                  preload="metadata"
                  width={160}
                  height={90}
                  // Optionally show controls for debug:
                  // controls
                  onError={e => {
                    // If video fails to load, show placeholder or fallback
                    e.currentTarget.poster = "https://via.placeholder.com/160x90?text=No+Preview";
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
