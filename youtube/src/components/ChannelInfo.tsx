import { useRouter } from "next/router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import data from "@/lib/data/videos";
import { useState, useEffect } from "react";
import {
  Clock,
  Download,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { formatDistanceToNow } from "date-fns";

const ChannelInfo = () => {
  const router = useRouter();
  const { id } = router.query;

  // Check if we're on a video page (has id parameter)
  const isVideoPage =
    (router.pathname.includes("/watch/") ||
      router.pathname.includes("/WatchVideo/")) &&
    id;
  const video = isVideoPage
    ? data.ALL_VIDEOS.find((v) => String(v._id) === String(id))
    : undefined;

  const { user, login } = useUser();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likes, setlikes] = useState(video?.Like || 0);
  const [dislikes, setDislikes] = useState(video?.Dislike || 0);
  
  const initialLiked = user?.likedVideos?.some((v: any) => String(v.videoId) === String(id));
  const initialWatchLater = user?.watchLater?.some((v: any) => String(v.videoId) === String(id));

  const [isLiked, setIsLiked] = useState(initialLiked || false);
  const [isWatchLater, setIsWatchLater] = useState(initialWatchLater || false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Update states when video or user changes
  useEffect(() => {
    if (video) {
      setlikes(video.Like || 0);
      setDislikes(video.Dislike || 0);
      setIsLiked(user?.likedVideos?.some((v: any) => String(v.videoId) === String(video._id)) || false);
      setIsWatchLater(user?.watchLater?.some((v: any) => String(v.videoId) === String(video._id)) || false);
      setIsDisliked(false);
    }
  }, [video, user]);

  // Only render if we're on a video page and video exists
  if (!isVideoPage || !video) return null;

  const handleLike = async () => {
    if (!user) return;
    try {
      if (isLiked) {
        setlikes((prev: number) => prev - 1);
        setIsLiked(false);
        const res = await axiosInstance.post("/user/user/data", { userId: user._id || user.id, type: "liked", action: "remove", videoId: id });
        if (res.data?.user) login(res.data.user);
      } else {
        setlikes((prev: number) => prev + 1);
        setIsLiked(true);
        if (isDisliked) {
          setDislikes((prev: number) => prev - 1);
          setIsDisliked(false);
        }
        const res = await axiosInstance.post("/user/user/data", { userId: user._id || user.id, type: "liked", action: "add", videoId: id });
        if (res.data?.user) login(res.data.user);
      }
    } catch (error) {
      console.log("Error liking", error);
    }
  };

  const handleDislike = () => {
    if (!user) return;
    if (isDisliked) {
      setDislikes((prev: number) => prev - 1);
      setIsDisliked(false);
    } else {
      setDislikes((prev: number) => prev + 1);
      setIsDisliked(true);
      if (isLiked) {
        setlikes((prev: number) => prev - 1);
        setIsLiked(false);
        // We'd theoretically want to also call the backend to remove the like here
        axiosInstance
          .post("/user/user/data", { userId: user._id || user.id, type: "liked", action: "remove", videoId: id })
          .then((res: any) => res.data?.user && login(res.data.user))
          .catch((e: any) => console.error(e));
      }
    }
  };

  const handleWatchLater = async () => {
    if (!user) return;
    try {
      if (isWatchLater) {
        setIsWatchLater(false);
        const res = await axiosInstance.post("/user/user/data", { userId: user._id || user.id, type: "watchLater", action: "remove", videoId: id });
        if (res.data?.user) login(res.data.user);
      } else {
        setIsWatchLater(true);
        const res = await axiosInstance.post("/user/user/data", { userId: user._id || user.id, type: "watchLater", action: "add", videoId: id });
        if (res.data?.user) login(res.data.user);
      }
    } catch (error) {
      console.log("Error finding watch later", error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Video Title */}
      <h1 className="text-2xl font-semibold">{video.videotitle}</h1>

      <div className="flex  gap-47">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{video.videochanel[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{video.videochanel}</h3>
            <p className="text-sm text-gray-600">1.2M subscribers</p>
          </div>
          <Button
            onClick={() => setIsSubscribed(!isSubscribed)}
            variant={isSubscribed ? "outline" : "default"}
            className={
              isSubscribed
                ? "bg-gray-100"
                : "bg-red-600 hover:bg-red-700 text-white"
            }
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>

        <div className="flex items-center  gap-3">
          <div className="flex items-center bg-gray-100 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-l-full"
              onClick={handleLike}
            >
              <ThumbsUp
                className={`w-5 h-5 mr-2 ${isLiked ? "fill-black text-black" : ""
                  }`}
              />
              {likes.toLocaleString()}
            </Button>
            <div className="w-px h-6 bg-gray-500" />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-r-full"
              onClick={handleDislike}
            >
              <ThumbsDown
                className={`w-5 h-5 mr-2 ${isDisliked ? "fill-black text-black" : ""
                  }`}
              />
              {dislikes.toLocaleString()}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`bg-gray-100 rounded-full ${isWatchLater ? "text-primary font-bold" : ""}`}
            onClick={handleWatchLater}
          >
            <Clock className="w-5 h-5 mr-2" />
            {isWatchLater ? "Saved" : "Watch Later"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-100 rounded-full"
          >
            <Share className="w-5 h-5 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-100 rounded-full"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-100 rounded-full"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="bg-gray-100 w-220 rounded-lg p-4">
        <div className="flex gap-4 text-sm font-medium mb-2">
          <span>{video.views.toLocaleString()} views</span>
          <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
        </div>
        <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
          <p>
            Sample video description. This would contain the actual video
            description from the database.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 p-0 h-auto font-medium"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show less" : "Show more"}
        </Button>
      </div>
    </div>
  );
};

export default ChannelInfo;
