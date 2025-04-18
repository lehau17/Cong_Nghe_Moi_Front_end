import ChatList from "@/components/shared/ChatList";
import ChatWindow from "@/components/shared/ChatWindow";
import Sidebar from "@/components/shared/Sidebar";

const ChatTemplate = () => {

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar />
            <ChatList />
            <div className="flex flex-col flex-1 h-screen">
                <div className="flex-1 overflow-auto">
                    <ChatWindow />
                </div>
            </div>
        </div>
    );
};

export default ChatTemplate;
