import FriendList from "@/components/shared/FriendList";
import Sidebar from "@/components/shared/Sidebar";

const FriendListTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      <FriendList />

      <div className="flex flex-col flex-1 h-screen">

        {/* Nội dung động */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default FriendListTemplate;
