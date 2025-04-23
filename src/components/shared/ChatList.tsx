import { getConversationDetailOrCreate, getMyConversations } from "@/apis/conversation.api";
import { sendFriendRequest } from "@/apis/friend-request.api";
import { getUserProfile, searchUserByPhone } from "@/apis/user.api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatContext } from "@/context/ChatContext";
import { SocketContext } from "@/context/SocketContext";
import { UserProfile } from "@/types/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { FaUserFriends, FaUserPlus } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDebounce } from "react-use";
import CreateGroupModal from "./CreateGroupModal";
import FriendSearchModal from "./FriendSearchModal";

const ChatList = () => {
    const socket = useContext(SocketContext);
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [showFriendModal, setShowFriendModal] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    const {
        setActiveUser,
        setConversationId,
        conversationId,
        conversationList,
        setConversationList,
    } = useChatContext();

    const { data: profile } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
    });

    useEffect(() => {
        if (profile?.data?.data?._id) {
            setCurrentUserId(profile.data.data._id);
        }
    }, [profile]);

    const { data: conversations, isSuccess } = useQuery({
        queryKey: ["myConversations"],
        queryFn: getMyConversations,
    });

    useEffect(() => {
        if (isSuccess) {
            setConversationList(conversations.data.data);
        }
    }, [isSuccess]);

    const sendFriendMutation = useMutation({
        mutationFn: (toId: string) => sendFriendRequest(toId),
        onSuccess: () => toast.success("Gửi lời mời kết bạn thành công !"),
        onError: () => toast.error("Gửi lời mời kết bạn thất bại"),
    });

    const { data: searchResult, refetch } = useQuery({
        queryKey: ["searchUserByPhone", searchValue],
        queryFn: () => searchUserByPhone(searchValue),
        enabled: false,
    });

    const userFound = searchResult?.data?.data;

    const handleFocus = () => {
        setIsSearching(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    useDebounce(
        () => {
            if (searchValue.length === 10) refetch();
        },
        500,
        [searchValue]
    );

    const handleClear = () => {
        setSearchValue("");
        setIsSearching(false);
    };


    const handleSelectGroup = (conv: any) => {
        setConversationId(conv._id);
        setActiveUser({
            _id: conv._id,
            fullName: conv.name,
            avatar: conv.avatar,
            type: 'group'
        });
        socket.emit("join-room", conv._id);
    };


    const handleSelectUser = async (user: UserProfile, _id?: string) => {
        setActiveUser(user);
        if (_id) {
            setConversationId(_id);
            return;
        }

        try {
            const res = await getConversationDetailOrCreate(user._id);
            const id = res.data.data._id;
            setConversationId(id);
            socket.emit("join-room", id);
        } catch (err) {
            console.error("Lỗi lấy/tạo conversation", err);
        }
    };

    return (
        <div className="w-90 bg-white h-screen flex flex-col border-r">
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
                <FaUserPlus
                    className="text-gray-600 cursor-pointer text-xl"
                    onClick={() => setShowFriendModal(true)}
                />
                <FaUserFriends
                    className="text-gray-600 cursor-pointer text-xl"
                    onClick={() => setShowCreateGroup(true)}
                />
                {/* <IoMdMore className="text-gray-600 ml-2 cursor-pointer text-xl" /> */}
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
                                className="group relative flex justify-between items-center hover:bg-gray-[50] p-2 rounded-md"
                                onClick={() => handleSelectUser(userFound)}
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full mr-2 border-1 border-black  bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                                        {userFound.avatar && userFound.avatar !== "" ? (
                                            <img src={userFound.avatar} className="w-full h-full object-cover rounded-full" alt="avatar" />
                                        ) : (
                                            userFound.fullName
                                                ?.split(" ")
                                                .map((w) => w[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()
                                        )}
                                    </div>

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
                        const isGroup = conv.type === "group";
                        const otherUser = conv.participants.find((p) => p._id !== currentUserId);
                        const isActive = conv._id === conversationId;

                        const displayName = isGroup ? conv.name : otherUser?.fullName;
                        const displayAvatar = isGroup ? conv.avatar : otherUser?.avatar;

                        if (!displayName) return null;

                        return (
                            <div
                                key={conv._id}
                                onClick={() =>
                                    isGroup
                                        ? handleSelectGroup(conv)
                                        : handleSelectUser(otherUser as UserProfile, conv._id)
                                }

                                className={`flex items-center px-4 py-3 cursor-pointer ${isActive ? "bg-[#dbebff]" : "hover:bg-[#dbebff]"}`}
                            >
                                <div className="relative w-12 h-12">
                                    <div className="w-12 h-12 rounded-full border-1 border-black bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-base overflow-hidden">
                                        {displayAvatar ? (
                                            <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            displayName
                                                ?.split(" ")
                                                .map((w: string) => w[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 ml-3">
                                    <div className="flex justify-between">
                                        <span className="font-[480] text-[15px]">{displayName}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 text-start">
                                        {conv.lastMessage?.sender?.label} :{" "}
                                        {conv.lastMessage?.type !== "text" ? `[${conv.lastMessage?.type}]` : (
                                            <span>{conv.lastMessage?.content || "Chưa có tin nhắn"}</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <FriendSearchModal
                open={showFriendModal}
                onClose={() => setShowFriendModal(false)}
                onSelectUser={(user) => handleSelectUser(user)}
            />
            <CreateGroupModal open={showCreateGroup} onClose={() => setShowCreateGroup(false)} />

        </div>
    );
};

export default ChatList;
