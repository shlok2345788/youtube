import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface VideoProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
    filename: string;
    videochanel: string;
    views: number;
    createdAt: string;
    thumbnailUrl?: string;
  };
}

export default function VideoCard({ video }: VideoProps) {
  if (!video) return null;

  const smallVideo = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' // Using a different sample video for variety
  // const videoSrc = `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}`;

  return (
    <Link href={`/watch/${video._id}`} className="group">
      <div className="space-y-3">

        <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
          <img
            src={video.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&q=80"}
            alt={video.videotitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/640x360?text=Video+Unavailable";
            }}
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            10:24
          </div>
        </div>
        <div className="flex gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback>{video.videochanel[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 text-foreground">
              {video.videotitle}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">{video.videochanel}</p>
            <p className="text-sm text-muted-foreground">
              {video.views.toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt))} ago
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}