import { useCallContext } from "@/context/CallContext";
import { SocketContext } from "@/context/SocketContext";
import { agoraService, localVideoTrack } from "@/services/agoraService";
import { useContext, useEffect, useRef, useState } from "react";

const CallUI = () => {
    const socket = useContext(SocketContext);
    const { showCallUI, setShowCallUI, callInfo } = useCallContext();

    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    const localRef = useRef<HTMLDivElement>(null);
    const remoteRef = useRef<HTMLDivElement>(null);

    // Auto-play local/remote tracks when Call UI is shown
    useEffect(() => {
        if (!showCallUI) return;

        const playTracks = () => {
            if (localRef.current && localVideoTrack) {
                localVideoTrack.play(localRef.current);
            }
            if (remoteRef.current) {
                // remote track sẽ được handle khi user-joined ở service
            }
        };

        setTimeout(playTracks, 200); // đợi DOM render xong
    }, [showCallUI]);

    const handleToggleMic = async () => {
        await agoraService.toggleMic(!micOn);
        setMicOn(!micOn);
    };

    const handleToggleCam = async () => {
        await agoraService.toggleCam(!camOn);
        setCamOn(!camOn);
    };

    const handleEndCall = async () => {
        await agoraService.leaveChannel();

        if (callInfo?.conversationId) {
            socket.emit("end-call", { conversationId: callInfo.conversationId });
        }

        setShowCallUI(false);
    };

    if (!showCallUI) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 shadow-lg border bg-black rounded-lg overflow-hidden w-[640px] h-[360px] flex">
            {/* Local Video */}
            <div ref={localRef} className="w-1/2 h-full relative">
                <div className="absolute top-1 left-1 text-white text-sm bg-black/50 px-2 py-1 rounded">Bạn</div>
            </div>

            {/* Remote Video */}
            <div ref={remoteRef} id="remote-video-container" className="w-1/2 h-full relative">
                <div className="absolute top-1 left-1 text-white text-sm bg-black/50 px-2 py-1 rounded">Đối phương</div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 bg-gray-900 px-4 py-2 rounded text-white">
                <button onClick={handleToggleMic}>
                    {micOn ? "🎙️ Tắt Mic" : "🎙️ Bật Mic"}
                </button>
                <button onClick={handleToggleCam}>
                    {camOn ? "📷 Tắt Cam" : "📷 Bật Cam"}
                </button>
                <button onClick={handleEndCall} className="text-red-400">
                    ❌ Kết thúc
                </button>
            </div>
        </div>
    );
};

export default CallUI;
