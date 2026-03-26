import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Video from '../'

interface VideoProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
    filename: string;
    videochanel: string;
    views: number;
    createdAt: string;
  };
}

export default function VideoCard({ video }: VideoProps) {
  if (!video) return null;

  // const videoSrc = `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}`;

  const videoSrc = video.filepath
  return (
    <Link href={`/watch/${video._id}`} className="group">
      <div className="space-y-3">

        {/* Thumbnail */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          <video
            src={videoSrc}
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            muted
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />

          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            10:24
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 text-black">
            <AvatarFallback>{video.videochanel[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 text-black ">
              {video.videotitle}
            </h3>

            <p className="text-sm text-gray-600 mt-1">{video.videochanel}</p>

            <p className="text-sm text-gray-600">
              {video.views.toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt))} ago
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
