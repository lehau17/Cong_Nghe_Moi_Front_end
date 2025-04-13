import { Button } from "@/components/ui/button";
import { AudioOutlined, MoreOutlined, PaperClipOutlined, PictureOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useEffect, useRef, useState } from "react";
import { IoCallOutline, IoSearchOutline, IoVideocamOutline } from "react-icons/io5";
import ConversationInfoPanel from "./ConversationInfoPanel";


export const messages = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    sender: "Bạn",
    text: `Tin nhắn số ${i + 1}`,
}));

const ChatWindow = () => {
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement | null>(null);
    const [showInfo, setShowInfo] = useState(false);

    // Tự động scroll xuống cuối khi render
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (<>
        <div className="flex flex-col h-screen bg-[#f0f2f5]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                    <Avatar size="large" src="https://randomuser.me/api/portraits/women/1.jpg" />
                    <div className="ml-3">
                        <div className="font-semibold text-[16px]">ục ằng oan inh êu</div>
                        <div className="text-sm text-gray-500 text-start">NiTo Nóng</div>
                    </div>
                </div>
                <div className="flex items-center space-x-4 text-xl text-gray-600">
                    <IoCallOutline className="cursor-pointer" />
                    <IoVideocamOutline className="cursor-pointer" />
                    <IoSearchOutline className="cursor-pointer" />
                    <MoreOutlined className="cursor-pointer" onClick={() => setShowInfo(!showInfo)} />
                </div>
            </div>

            {/* Danh sách tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-2" onClick={() => {
                if (showInfo) setShowInfo(false);
            }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="self-end bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-[70%]"
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            {/* Khung nhập tin nhắn */}
            <div className="border-t bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                    <SmileOutlined className="text-xl cursor-pointer" />
                    <PaperClipOutlined className="text-xl cursor-pointer" />
                    <PictureOutlined className="text-xl cursor-pointer" />
                    <AudioOutlined className="text-xl cursor-pointer" />
                    <div className="flex-1">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Nhập @, tin nhắn tới ục ằng oan inh êu`}
                            className="w-full bg-gray-100 p-2 rounded-xl border border-gray-300 outline-none"
                        />
                    </div>
                    <Button variant="ghost" size="icon">
                        <SendOutlined />
                    </Button>
                </div>
            </div>
        </div>
        {showInfo && <ConversationInfoPanel onClose={() => setShowInfo(false)} />}

    </>
    );
};

export default ChatWindow;
