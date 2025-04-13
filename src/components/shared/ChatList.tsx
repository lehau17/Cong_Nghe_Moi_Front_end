import { getMyConversations } from "@/apis/conversation.api";
import { sendFriendRequest } from "@/apis/friend-request.api";
import { getUserProfile, searchUserByPhone } from "@/apis/user.api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "@/types/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const ChatList = ({ onSelectUser }: { onSelectUser: (user: UserProfile | null) => void }) => {
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const { data: profile } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
    });

    useEffect(() => {
        if (profile?.data?.data?._id) {
            setCurrentUserId(profile.data.data._id);
        }
    }, [profile]);

    const { data: conversations } = useQuery({
        queryKey: ["myConversations"],
        queryFn: getMyConversations,
    });

    const sendFriendMutation = useMutation({
        mutationFn: (toId: string) => sendFriendRequest(toId),
        onSuccess: () => toast.success("\u0110\u00e3 g\u1eedi l\u1eddi m\u1eddi k\u1ebft b\u1ea1n!"),
        onError: () => toast.error("G\u1eedi l\u1eddi m\u1eddi th\u1ea5t b\u1ea1i"),
    });

    const { data: searchResult, refetch } = useQuery({
        queryKey: ["searchUserByPhone", searchValue],
        queryFn: () => searchUserByPhone(searchValue),
        enabled: false,
    });

    const userFound = searchResult?.data?.data;
    const conversationList = conversations?.data?.data || [];

    const handleFocus = () => {
        setIsSearching(true);
        if (searchValue.trim().length === 10) refetch();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value.length === 10) refetch();
    };

    const handleClear = () => {
        setSearchValue("");
        setIsSearching(false);
    };

    return (
        <div className="w-90 bg-white h-screen flex flex-col border-r">
            {/* Header */}
            <div className="p-2 flex items-center border-b space-x-2">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm"
                        value={searchValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        className="w-full bg-gray-100 px-2 py-2 pr-8 rounded-lg outline-none"
                    />
                    {searchValue && (
                        <IoClose
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-xl"
                            onClick={handleClear}
                        />
                    )}
                </div>
                <FaUserPlus className="text-gray-600 cursor-pointer text-xl" />
                <IoMdMore className="text-gray-600 ml-2 cursor-pointer text-xl" />
            </div>

            {!isSearching && (
                <div className="flex border-b px-4 text-gray-600 pt-3 text-sm">
                    <div className="mr-4 font-semibold border-b-2 border-blue-600 pb-2 text-blue-600">
                        Tất cả
                    </div>
                    <div className="mr-4 pb-2 cursor-pointer">Chưa đọc</div>
                    <div className="ml-auto pb-2 cursor-pointer">Phân loại ▾</div>
                </div>
            )}

            <div className="overflow-auto flex-1">
                {isSearching && searchValue ? (
                    <div className="text-sm text-gray-700">
                        {userFound ? (
                            <div
                                className="group relative flex justify-between items-center hover:bg-gray-100 p-2 rounded-md"
                                onClick={() => onSelectUser(userFound)}
                            >
                                <div className="flex items-center">
                                    <img
                                        src={userFound.avatar}
                                        className="w-10 h-10 rounded-full mr-2 border"
                                        alt="avatar"
                                    />
                                    <div>
                                        <div className="font-semibold">{userFound.fullName}</div>
                                        <div className="text-sm text-gray-500">
                                            Số điện thoại: {userFound.phoneNumber}
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <IoMdMore className="text-xl text-gray-600" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56 bg-white rounded-xl shadow-xl border text-sm p-1"
                                        align="end"
                                    >
                                        <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-start">
                                            Thêm vào nhóm
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-start"
                                            onClick={() => userFound?._id && sendFriendMutation.mutate(userFound._id)}
                                        >
                                            Gửi lời mời kết bạn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-start">
                                            Báo xấu
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-red-50 text-red-500 cursor-pointer text-start">
                                            Xoá hội thoại
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="italic text-gray-400 px-4 py-2">Không tìm thấy người dùng</div>
                        )}
                    </div>
                ) : (
                    conversationList.map((conv) => {
                        const otherUser = conv.participants.find((p) => p._id !== currentUserId);
                        if (!otherUser) return null;
                        return (
                            <div
                                key={conv._id}
                                onClick={() => onSelectUser(otherUser)}
                                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100"
                            >
                                <div className="relative w-12 h-12">
                                    <img
                                        src={otherUser.avatar}
                                        alt="Avatar"
                                        className="w-12 h-12 rounded-full border"
                                    />
                                </div>
                                <div className="flex-1 ml-3">
                                    <div className="flex justify-between">
                                        <span className="font-[480] text-[15px]">{otherUser.fullName}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 text-start">
                                        {conv.lastMessage?.sender.label} : <span>{conv.lastMessage?.content || "Chưa có tin nhắn"}</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatList;
