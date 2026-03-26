import React, { useEffect } from "react";
import { useUser } from "@/lib/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { ALL_VIDEOS } from "@/lib/data/videos";
import { formatDistanceToNow } from "date-fns";
import { Download, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "sonner";

export default function DownloadsPage() {
    const { user, login, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;

    const handleRemove = async (e: React.MouseEvent, videoId: string) => {
        e.preventDefault(); // Prevent navigating to the video page
        e.stopPropagation();

        if (!user) return;
        const userId = user._id || user.id;

        try {
            const res = await axiosInstance.delete(`/user/user/download/${userId}/${videoId}`);
            if (res.data.user) {
                login(res.data.user); // Update local state!
                toast.success("Download removed");
            }
        } catch (error) {
            console.error("Failed to remove download", error);
            toast.error("Failed to remove download");
        }
    };

    if (!user) return null;

    interface DownloadedVideo {
        videoId: string;
        videoTitle: string;
        videoThumbnail: string;
        videoChannel: string;
        downloadedAt: string;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-full">
                    <Download className="w-6 h-6 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Downloads</h1>
            </div>

            {user.downloads && user.downloads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {user.downloads.map((video: DownloadedVideo, index: number) => {
                        const actualThumbnail = ALL_VIDEOS.find(v => String(v._id) === String(video.videoId))?.thumbnailUrl || video.videoThumbnail;
                        
                        return (
                        <Link href={`/watch/${video.videoId}`} key={index}>
                            <div className="flex flex-col gap-2 cursor-pointer group">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-secondary">
                                    <img
                                        src={actualThumbnail === "/img/thumbnail.png" ? "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&q=80" : (actualThumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&q=80")}
                                        alt={video.videoTitle}
                                        className="h-full w-full object-cover group-hover:scale-105 duration-200"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/640x360?text=No+Thumbnail";
                                        }}
                                    />
                                    <button
                                        onClick={(e) => handleRemove(e, video.videoId)}
                                        className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        title="Remove download"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold line-clamp-2">
                                        {video.videoTitle}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{video.videoChannel}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Downloaded {formatDistanceToNow(new Date(video.downloadedAt))} ago
                                    </p>
                                </div>
                            </div>
                        </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h2 className="text-xl font-semibold mb-2">No downloads yet</h2>
                    <p className="text-muted-foreground mb-6">
                        Videos you download will appear here.
                    </p>
                    <Link href="/">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                            Explore Videos
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
