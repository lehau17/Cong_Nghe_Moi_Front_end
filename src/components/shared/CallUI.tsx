import { useCallContext } from "@/context/CallContext";

const CallUI = () => {
    const { showCallUI } = useCallContext();

    if (!showCallUI) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 shadow-lg border bg-black rounded-lg overflow-hidden">
            <div id="video-container" className="w-[300px] h-[300px]" />
            {/* Có thể thêm nút tắt camera, end call, v.v */}
        </div>
    );
};

export default CallUI;
