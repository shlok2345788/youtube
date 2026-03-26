"use client";

// Redirecting to CustomVideoPlayer for gesture controls
import CustomVideoPlayer from './CustomVideoPlayer';

interface VideoPlayerProps {
    video: {
        _id: string;
        videotitle: string;
        filepath: string;
    };
    onNextVideo?: () => void;
    onCloseVideo?: () => void;
    onShowComments?: () => void;
}

export default function VideoPlayer(props: VideoPlayerProps) {
    return <CustomVideoPlayer {...props} />;
}