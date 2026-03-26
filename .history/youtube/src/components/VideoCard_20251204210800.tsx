import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function VideoCard({ video }: any) {
    return (
        <Link href={`/watch/${video?._id}`} className="group">
            <div className="space-y-3">

                {/* Video Preview Thumbnail */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                        src={video.file}
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

                {/* Video Details */}
                <div className="flex gap-3">
                    <Avatar className="w-9 h-9  ">
                        <AvatarFallback>{video?.videochanel?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
                            {video?.videotitle ?? "Untitled Video"}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                            {video?.videochanel ?? "Unknown Channel"}
                        </p>

                        <p className="text-sm text-gray-600">
                            {(video?.views ?? 0).toLocaleString()} views •{" "}
                            {video?.createdAt
                                ? formatDistanceToNow(new Date(video.createdAt))
                                : "some time"}{" "}
                            ago
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
