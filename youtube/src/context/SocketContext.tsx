import React, { createContext, useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';

interface SocketContextType {
    call: any; // Type to Call Object
    callAccepted: boolean;
    myVideo: React.RefObject<HTMLVideoElement | null>;
    userVideo: React.RefObject<HTMLVideoElement | null>;
    stream: MediaStream | undefined;
    name: string;
    setName: (name: string) => void;
    callEnded: boolean;
    me: string;
    callUser: (id: string) => void;
    answerCall: () => void;
    leaveCall: () => void;
    shareScreen: () => void;
    screenStream: MediaStream | undefined;
    startCamera: () => void;
    stopCamera: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// const socket = io('http://127.0.0.1:5000'); // Check PORT
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000');


const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | undefined>(undefined);
    const [me, setMe] = useState('');
    const [call, setCall] = useState<any>({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [screenStream, setScreenStream] = useState<MediaStream | undefined>(undefined);

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance | null>(null);

    const startCamera = async () => {
        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(undefined);
        }
    };

    useEffect(() => {
        socket.on('me', (id) => setMe(id));

        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });
    }, []);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from });
        });

        peer.on('stream', (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const callUser = (id: string) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        window.location.reload();
    };

    const shareScreen = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true } as DisplayMediaStreamOptions);
            setScreenStream(screenStream);

            // If already connected, replace video track
            if (connectionRef.current) {
                const videoTrack = screenStream.getVideoTracks()[0];
                const sender = (connectionRef.current as any).replaceTrack(
                    stream?.getVideoTracks()[0],
                    videoTrack,
                    stream
                );

                // Listen for screen sharing stop
                videoTrack.onended = () => {
                    if (connectionRef.current && stream) {
                        (connectionRef.current as any).replaceTrack(
                            videoTrack,
                            stream.getVideoTracks()[0],
                            stream
                        );
                    }
                    setScreenStream(undefined);
                };
            }

        } catch (error) {
            console.error("Error sharing screen:", error);
        }
    }

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            answerCall,
            leaveCall,
            shareScreen,
            screenStream,
            startCamera,
            stopCamera
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
