import { useCallContext } from "@/context/CallContext";
import { SocketContext } from "@/context/SocketContext";
import { agoraService } from "@/services/agoraService";
import { useContext, useState } from "react";




const CallUI = () => {
    const socket = useContext(SocketContext);
    const { showCallUI,
        setShowCallUI,
        callInfo } = useCallContext();

    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    if (!showCallUI) return null;

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

    return (
        <div className="fixed bottom-5 right-5 z-50 shadow-lg border bg-black rounded-lg overflow-hidden">
            <div id="video-container" className="w-[300px] h-[300px]" />

            <div className="flex justify-center gap-3 bg-gray-900 text-white py-2">
                <button onClick={handleToggleMic}>
                    {micOn ? "🎙️ Tắt Mic" : "🎙️ Bật Mic"}
                </button>
                <button onClick={handleToggleCam}>
                    {camOn ? "📷 Tắt Cam" : "📷 Bật Cam"}
                </button>
                <button onClick={handleEndCall} className="text-red-400">❌ Kết thúc</button>
            </div>
        </div>
    );
};

export default CallUI;
