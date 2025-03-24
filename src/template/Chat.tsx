import ChatList from "@/components/shared/ChatList";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";

const ChatTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      <ChatList />

      <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <Header />

        {/* Nội dung động */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default ChatTemplate;
