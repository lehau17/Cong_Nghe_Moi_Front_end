import { getConversationDetailOrCreate, sendMessage } from "@/apis/conversation.api";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/user.type";
import {
    AudioOutlined,
    MoreOutlined,
    PaperClipOutlined,
    PictureOutlined,
    SendOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import { useEffect, useRef, useState } from "react";
import { IoCallOutline, IoSearchOutline, IoVideocamOutline } from "react-icons/io5";
import ConversationInfoPanel from "./ConversationInfoPanel";

const ChatWindow = ({ user }: { user: UserProfile | null }) => {
    const [input, setInput] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const endRef = useRef<HTMLDivElement | null>(null);

    const currentUserId = JSON.parse(localStorage.getItem("profile") as string)._id
    const {
        data: conversationDetail,
        isLoading,
    } = useQuery({
        queryKey: ["conversation-detail", user?._id],
        queryFn: () => getConversationDetailOrCreate(user!._id),
        enabled: !!user,
    });

    const conversationId = conversationDetail?.data?.data._id;
    const messages = conversationDetail?.data?.data?.messages || [];

    const sendMessageMutation = useMutation({
        mutationFn: (content: string) => sendMessage(conversationId, content),
        onSuccess: () => {
            setInput("");
        },
    });

    const handleSend = () => {
        if (!input.trim() || !conversationId) return;
        sendMessageMutation.mutate(input.trim());
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                👉 Chọn 1 cuộc trò chuyện để bắt đầu!
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#f0f2f5]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                    <Avatar size="large" src={user.avatar} />
                    <div className="ml-3">
                        <div className="font-semibold text-[16px]">{user.fullName}</div>
                        <div className="text-sm text-gray-500 text-start">Đang hoạt động</div>
                    </div>
                </div>
                <div className="flex items-center space-x-4 text-xl text-gray-600">
                    <IoCallOutline className="cursor-pointer" />
                    <IoVideocamOutline className="cursor-pointer" />
                    <IoSearchOutline className="cursor-pointer" />
                    <MoreOutlined className="cursor-pointer" onClick={() => setShowInfo(!showInfo)} />
                </div>
            </div>

            {/* Messages */}
            <div
                className="flex-1 p-4 overflow-y-auto flex flex-col justify-end space-y-2"
                onClick={() => showInfo && setShowInfo(false)}
            >
                {isLoading ? (
                    <div className="text-gray-500 italic">Đang tải tin nhắn...</div>
                ) : (
                    messages.map((msg: any) => {
                        const isMine = msg.sender._id === currentUserId;
                        return (
                            <div
                                key={msg._id}
                                className={`${isMine
                                    ? "self-start bg-gray-200 text-black"
                                    : "self-end bg-blue-500 text-white"
                                    } px-4 py-2 rounded-2xl max-w-[70%]`}
                            >
                                {msg.content}
                            </div>
                        );
                    })
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
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
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder={`Nhập @, tin nhắn tới ${user.fullName}`}
                            className="w-full bg-gray-100 p-2 rounded-xl border border-gray-300 outline-none"
                        />
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleSend}>
                        <SendOutlined />
                    </Button>
                </div>
            </div>

            {showInfo && <ConversationInfoPanel onClose={() => setShowInfo(false)} />}
        </div>
    );
};

export default ChatWindow;
