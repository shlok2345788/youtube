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

  // Always call hooks unconditionally
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likes, setlikes] = useState(video?.Like || 0);
  const [dislikes, setDislikes] = useState(video?.Dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Update likes/dislikes when video changes
  useEffect(() => {
    if (video) {
      setlikes(video.Like || 0);
      setDislikes(video.Dislike || 0);
      setIsLiked(false);
      setIsDisliked(false);
    }
  }, [video]);

  // Only render if we're on a video page and video exists
  if (!isVideoPage || !video) return null;

  const handleLike = () => {
    if (!data.user) return;
    try {
      if (isLiked) {
        setlikes((prev: number) => prev - 1);
        setIsLiked(false);
      } else {
        setlikes((prev: number) => prev + 1);
        setIsLiked(true);
        if (isDisliked) {
          setDislikes((prev: number) => prev - 1);
          setIsDisliked(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDislike = () => {
    if (!data.user) return;
    try {
      if (isDisliked) {
        setDislikes((prev: number) => prev - 1);
        setIsDisliked(false);
      } else {
        setDislikes((prev: number) => prev + 1);
        setIsDisliked(true);
        if (isLiked) {
          setlikes((prev: number) => prev - 1);
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.log(error);
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
          {/* <Button
            variant="ghost"
            size="sm"
            className={`bg-gray-100 rounded-full ${isWatchLater ? "text-primary" : ""
              }`}
          // onClick={handleWatchLater}
          >
            <Clock className="w-5 h-5 mr-2" />
            {isWatchLater ? "Saved" : "Watch Later"}
          </Button> */}
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
