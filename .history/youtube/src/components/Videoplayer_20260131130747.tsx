"use client";

interface VideoPlayerProps {
    video: {
        _id: string;
        videotitle: string;
        filepath: string;
    };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
    return (
        <div className="w-220 aspect-video bg-black rounded-lg overflow-hidden">
            <video
                className="w-full h-full object-contain"
                controls
                preload="metadata"
                key={video._id}
            >
                <source src={video.filepath} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}