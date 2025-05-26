import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearLS } from "@/lib/auth";
import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";

const Sidebar = () => {
    const [openProfile, setOpenProfile] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const navigate = useNavigate();

    const userProfile = localStorage.getItem("profile");
    const user = userProfile ? JSON.parse(userProfile) : null;
    const userName = user?.fullName || "Người dùng";
    const userAvatar = user?.avatar;
    console.log("check user", user)
    return (
        <>
            <div className="w-16 bg-blue-600 h-screen flex flex-col items-center py-4 space-y-6 text-white">
                {/* Avatar + Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`}
                                alt="avatar-default"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56 bg-white text-black shadow-lg p-2" side="right">
                        <h3 className="font-semibold p-2 border-b">{userName}</h3>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                            Hồ sơ của bạn
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/setting")}>
                            Cài đặt
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => {
                                clearLS();
                                navigate("/login");
                            }}
                        >
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Menu icons */}
                <div className="flex flex-col space-y-6">
                    <FaUserFriends
                        size={24}
                        onClick={() => navigate("/chat")}
                        className="cursor-pointer"
                    />

                </div>

                {/* Nút cài đặt cuối sidebar */}
                <div className="mt-auto">
                    <IoSettingsSharp
                        size={24}
                        onClick={() => navigate("/setting")}
                        className="cursor-pointer"
                    />
                </div>
            </div>

            {/* Modals */}
            <ProfileModal open={openProfile} setOpen={setOpenProfile} />
            <SettingsModal open={openSettings} setOpen={setOpenSettings} />
        </>
    );
};

export default Sidebar;
