import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { clearLS } from "@/lib/auth";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { FaBriefcase, FaCloud, FaUserFriends } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { IoChatbubbleEllipsesSharp, IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal"; // Import modal cài đặt

const Sidebar = () => {
    const [openProfile, setOpenProfile] = useState(false);
    const [openSettings, setOpenSettings] = useState(false); // Thêm state modal cài đặt
    const navigate = useNavigate()
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
                        <DropdownMenuItem onClick={() => navigate("/setting")}>Cài đặt</DropdownMenuItem> {/* Mở modal cài đặt */}
                        <DropdownMenuItem className="text-red-500" onClick={() => {
                            clearLS()
                            navigate("/login")
                        }}>Đăng xuất</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Menu Icons */}
                <div className="flex flex-col space-y-6">
                    <IoChatbubbleEllipsesSharp
                        size={24}
                        onClick={() => navigate("/chat")}
                        className="cursor-pointer"
                    />

                    <HiOutlineClipboardList size={24} />
                    <FaCloud size={24} />
                    <FaUserFriends size={24} />
                    <FaBriefcase size={24} />
                </div>

                {/* Settings */}
                <div className="mt-auto">
                    <IoSettingsSharp size={24} onClick={() => setOpenSettings(true)} className="cursor-pointer" /> {/* Mở modal cài đặt */}
                </div>
            </div>

            {/* Profile Modal */}
            <ProfileModal open={openProfile} setOpen={setOpenProfile} />

            {/* Settings Modal */}
            <SettingsModal open={openSettings} setOpen={setOpenSettings} />
        </>
    );
};

export default Sidebar;
