import React, { useContext, useRef, useEffect, useState } from 'react';
import { SocketContext } from '@/context/SocketContext';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, Video, Mic, MicOff, Monitor, Disc } from 'lucide-react';
import { toast } from 'sonner';

import { useRouter } from 'next/router';

const VideoCall = () => {
    const router = useRouter();
    const {
        name,
        setName,
        callAccepted,
        myVideo,
        userVideo,
        callEnded,
        stream,
        call,
        me,
        callUser,
        answerCall,
        leaveCall,
        shareScreen,
        screenStream,
        startCamera,
        stopCamera
    } = useContext(SocketContext) as any;

    const [idToCall, setIdToCall] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startRecording = () => {
        if (!screenStream && !stream) {
            toast.error("No stream to record!");
            return;
        }

        // Record the screen stream if sharing, otherwise the camera stream
        const streamToRecord = screenStream || stream;

        // Combine audio if needed (e.g. mic + system audio)
        // For simplicity, we just record the primary video stream (screen or cam)

        try {
            const mediaRecorder = new MediaRecorder(streamToRecord, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.style.display = 'none';
                a.href = url;
                a.download = `recording-${Date.now()}.webm`;
                a.click();
                window.URL.revokeObjectURL(url);
                toast.success("Recording saved!");
            };

            mediaRecorder.start();
            setIsRecording(true);
            toast.info("Recording started...");
        } catch (err) {
            console.error(err);
            toast.error("Failed to start recording. Browser may not support webm.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative">
            <Button
                variant="ghost"
                className="absolute top-4 left-4 flex items-center gap-2"
                onClick={() => router.push('/')}
            >
                &larr; Back to Home
            </Button>

            <h1 className="text-3xl font-bold mb-8 text-gray-800">Video Call & Screen Share</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">
                {/* My Video */}
                {stream && (
                    <div className="p-2 border border-border rounded-lg bg-card shadow-md relative group">
                        <h3 className="absolute top-4 left-4 text-white bg-black/50 px-2 rounded">{name || 'Me'}</h3>
                        <video playsInline muted ref={myVideo} autoPlay className="w-full h-auto rounded-lg transform scale-x-[-1]" />
                    </div>
                )}

                {/* User Video */}
                {callAccepted && !callEnded && (
                    <div className="p-2 border border-border rounded-lg bg-card shadow-md relative">
                        <h3 className="absolute top-4 left-4 text-white bg-black/50 px-2 rounded">{call.name || 'User'}</h3>
                        <video playsInline ref={userVideo} autoPlay className="w-full h-auto rounded-lg" />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-8 bg-card p-6 rounded-xl shadow-lg w-full max-w-lg border border-border">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="bg-secondary border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                        <div className="flex items-center bg-secondary px-3 rounded text-sm text-muted-foreground">
                            ID: {me}
                        </div>
                        <Button onClick={() => { navigator.clipboard.writeText(me); toast.success("ID Copied!") }} variant="outline">Copy ID</Button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={idToCall}
                            onChange={(e) => setIdToCall(e.target.value)}
                            placeholder="ID to Call"
                            className="bg-secondary border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />

                        {callAccepted && !callEnded ? (
                            <Button onClick={leaveCall} variant="destructive">
                                <PhoneOff className="mr-2 h-4 w-4" /> Hang Up
                            </Button>
                        ) : (
                            <Button onClick={() => callUser(idToCall)}>
                                <Phone className="mr-2 h-4 w-4" /> Call
                            </Button>
                        )}
                    </div>

                    {/* Incoming Call Notification */}
                    {call.isReceivingCall && !callAccepted && (
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg animate-pulse">
                            <p className="font-semibold text-blue-700">{call.name || "Unknown"} is calling...</p>
                            <Button onClick={answerCall} className="bg-green-500 hover:bg-green-600">
                                Answer
                            </Button>
                        </div>
                    )}

                    <div className="flex justify-center gap-4 mt-4">
                        <Button onClick={shareScreen} variant="outline" title="Share Screen">
                            <Monitor className="h-5 w-5" />
                        </Button>

                        {!isRecording ? (
                            <Button onClick={startRecording} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" title="Start Recording">
                                <Disc className="h-5 w-5" />
                            </Button>
                        ) : (
                            <Button onClick={stopRecording} variant="destructive" className="animate-pulse" title="Stop Recording">
                                <Disc className="h-5 w-5" /> Stop
                            </Button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VideoCall;
