import FriendList from "@/components/shared/FriendList";
import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";

const FriendListTemplate = () => {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            <FriendList />

            <div className="flex flex-col flex-1 h-screen">

                {/* Nội dung động */}
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default FriendListTemplate;
