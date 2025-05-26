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

// Giao diện hiển thị danh sách ngừoi nhắn tin
const ChatList = () => {
    // socket IO . dùng để xử lý real time
    const socket = useContext(SocketContext);
    // lưu tữ giá trị search. măht định là rông
    // nếu người dùng nhập giá trị vào input
    // gọi hàm setSearchValue để cập nhật giá trị search
    const [searchValue, setSearchValue] = useState("");
    // Kiểm soát trang thái search
    // mạtư định là false vì nó chưa seach
    // nếu người dùng nhấn vào thanh search hoạt bắt đầu search
    // thì chuyển trạng thái thành true
    const [isSearching, setIsSearching] = useState(false);
    // Thoong tin userId của mình
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    // Dùng để kiểm soat ẩn hiện của model TÌm kiếm bạn bè
    // mặt định là false vì nó không hiện
    // nhấn vào nút tìm kiếm bạn bè thì nó sẽ chuyển thành true
    // Model hiện thỉ bạn bè sẽ hiện lên
    // tắt thì chuyển lại thành false
    const [showFriendModal, setShowFriendModal] = useState(false);
    // Dùng để kiểm soat ẩn hiện của model Tạo nhóm
    // mặt định là false vì nó không hiện
    // nhấn vào nút tạo nhóm thì nó sẽ chuyển thành true
    // Model hiện thỉ bạn bè sẽ hiện lên
    // tắt thì chuyển lại thành false
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    // Lưu thông tin chat global
    // dùng useContext của react để lưu thông tin
    const {
        // kiểm soát user nào đang sử dụng hiện tại
        setActiveUser,
        // Hàm dùng để cập nhật lại id của conversation mình đang muốn join vào
        setConversationId,
        // biến chứa conversation hiện tại
        conversationId,
        // danh sách conversation
        conversationList,
        // hàm dùng để set lại conversation
        setConversationList,
    } = useChatContext();

    // Hàm dùng để lấy thồng tin của user hiện tại
    // dùng tanstack query và axios
    const { data: profile } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
    });

    // userEffect dùng để kiểm soát trạng thái và re render giao diện
    // kiểm soát trạng tháo biến profile
    // nếu biến profile thay đổi
    // cap nhật lại currentUserId
    useEffect(() => {
        if (profile?.data?.data?._id) {
            setCurrentUserId(profile.data.data._id);
        }
    }, [profile]);


    // Lấy danh sách conversation
    // dùng tanstack query và axios
    // useQuery sẽ tự động chạy mỗi khi được gọi
    const { data: conversations, isSuccess } = useQuery({
        queryKey: ["myConversations"],
        queryFn: getMyConversations,
    });

    // useEfect này dùng để kiểm soát biến isSuccess
    useEffect(() => {
        // Nếu thành coong. cập nhật lại danh sách conversation
        if (isSuccess) {
            setConversationList(conversations.data.data);
        }
    }, [isSuccess]);

    // Hàm nayf dùng để gửi lời mời kết bạn
    // dùng tanstack query và axios
    const sendFriendMutation = useMutation({
        // gọi api
        mutationFn: (toId: string) => sendFriendRequest(toId),
        // Thành công : thông báo ra giao diện
        onSuccess: () => toast.success("Gửi lời mời kết bạn thành công !"),
        // Thất bại: thông báo ra giao diện
        onError: () => toast.error("Gửi lời mời kết bạn thất bại"),
    });

    // Hàm dungf để tìm kiếm user theo số địẹn thoai
    // enabled: false : đánh dấu để nó không tự động call
    const { data: searchResult, refetch } = useQuery({
        // khóa định danh duy nhất. dùng để kiểm soát cache
        queryKey: ["searchUserByPhone", searchValue],
        // Hàm để call API
        queryFn: () => searchUserByPhone(searchValue),
        // đánh dấu mặt định là không call.
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

    // sau 500ms nếu không có sự thay đổi thì mới call API
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

    // khi nhấn vào 1 conversation.
    // Mình sẽ set lại conversation global cho nó
    // bắn sự kiện join room cho be xử lý
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
                                        {conv.lastMessage?.sender?.label} :{""}
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
            {/* Model tìm kiếm bạn bè */}
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
