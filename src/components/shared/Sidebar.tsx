import { FaBriefcase, FaCloud, FaUserFriends } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { IoChatbubbleEllipsesSharp, IoSettingsSharp } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="w-16 bg-blue-600 h-screen flex flex-col items-center py-4 space-y-6 text-white">
      {/* Avatar */}
      <div className="w-10 h-10 bg-white text-blue-600 flex items-center justify-center rounded-full font-bold">
        LH
      </div>

      {/* Menu Icons */}
      <div className="flex flex-col space-y-6">
        <IoChatbubbleEllipsesSharp size={24} />
        <HiOutlineClipboardList size={24} />
        <FaCloud size={24} />
        <FaUserFriends size={24} />
        <FaBriefcase size={24} />
      </div>

      {/* Settings */}
      <div className="mt-auto">
        <IoSettingsSharp size={24} />
      </div>
    </div>
  );
};

export default Sidebar;
