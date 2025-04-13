import ChatList from "@/components/shared/ChatList";
import ChatWindow from "@/components/shared/ChatWindow";
import Sidebar from "@/components/shared/Sidebar";
import { UserProfile } from "@/types/user.type";
import { useState } from "react";

const ChatTemplate = () => {
    const [activeUser, setActiveUser] = useState<UserProfile | null>(null); // 👈 Lưu user được chọn để chat

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar />
            <ChatList onSelectUser={setActiveUser} />
            <div className="flex flex-col flex-1 h-screen">
                <div className="flex-1 overflow-auto">
                    <ChatWindow user={activeUser} />
                </div>
            </div>
        </div>
    );
};

export default ChatTemplate;
