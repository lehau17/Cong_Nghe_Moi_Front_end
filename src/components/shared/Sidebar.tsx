import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { FaBriefcase, FaCloud, FaUserFriends } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { IoChatbubbleEllipsesSharp, IoSettingsSharp } from "react-icons/io5";
import ProfileModal from "./ProfileModal";

const Sidebar = () => {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <div className="w-16 bg-blue-600 h-screen flex flex-col items-center py-4 space-y-6 text-white">
        {/* Avatar + Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 bg-white text-blue-600 flex items-center justify-center rounded-full font-bold cursor-pointer">
            LH
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white text-black shadow-lg p-2" side="right">
            <h3 className="font-semibold p-2 border-b">Lê Trung Hậu</h3>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenProfile(true)}>Hồ sơ của bạn</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Đăng xuất</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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

      {/* Profile Modal */}
      <ProfileModal open={openProfile} setOpen={setOpenProfile} />
    </>
  );
};

export default Sidebar;
