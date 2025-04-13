import { searchUserByPhone } from "@/apis/user.api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { IoClose } from "react-icons/io5";


const chats = [
    {
        id: 1,
        name: "ục ằng oan inh êu",
        message: "Bạn: 🏷️ Sticker",
        time: "24 phút",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        pinned: true,
    },
    {
        id: 2,
        name: "SinhVien_Nganh_SE_Kh...",
        message: "Nguyen Thi Hanh: Kính chào Quý Thầy...",
        time: "36 phút",
        group: true,
        unread: 99,
        avatars: [
            "https://randomuser.me/api/portraits/men/2.jpg",
            "https://randomuser.me/api/portraits/women/3.jpg",
        ],
    },
    {
        id: 3,
        name: "DSA",
        message: "Bạn: G(V < E)",
        time: "2 giờ",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        unread: 1,
        highlighted: true,
    },
];

const ChatList = () => {
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);


    const { data: searchResult, refetch } = useQuery({
        queryKey: ["searchUserByPhone", searchValue],
        queryFn: () => searchUserByPhone(searchValue),
        enabled: false,
    });

    const userFound = searchResult?.data?.data;

    const handleFocus = () => {
        setIsSearching(true);
        if (searchValue.trim().length === 10) {
            refetch();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.length === 10) {
            refetch();
        }
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

            {/* Tabs */}
            {!isSearching && (
                <div className="flex border-b px-4 text-gray-600 pt-3 text-sm">
                    <div className="mr-4 font-semibold border-b-2 border-blue-600 pb-2 text-blue-600 ">
                        Tất cả
                    </div>
                    <div className="mr-4 pb-2 cursor-pointer">Chưa đọc</div>
                    <div className="ml-auto pb-2 cursor-pointer">Phân loại ▾</div>
                </div>
            )}

            {/* Nội dung */}
            <div className="overflow-auto flex-1">
                {isSearching && searchValue ? (
                    <div className="text-sm text-gray-700">
                        {userFound ? (
                            <div className="group relative flex justify-between items-center hover:bg-gray-100 p-2 rounded-md">
                                {/* Thông tin user */}
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

                                {/* Nút Dropdown Menu với shadcn/ui */}
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
                                        <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-start">
                                            Gửi lời mời kết bạn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-start">
                                            Báo xấu
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="px-3 py-2 rounded-md hover:bg-red-50 text-red-500 cursor-pointer text-start"
                                        >
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
                    chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${chat.highlighted ? "bg-blue-100" : ""
                                }`}
                        >
                            <div className="relative w-12 h-12">
                                {chat.group ? (
                                    <div className="flex -space-x-2">
                                        {chat.avatars.map((src, idx) => (
                                            <img
                                                key={idx}
                                                src={src}
                                                alt="Avatar"
                                                className="w-8 h-8 rounded-full border"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <img
                                        src={chat.avatar}
                                        alt="Avatar"
                                        className="w-12 h-12 rounded-full"
                                    />
                                )}
                            </div>

                            <div className="flex-1 ml-3">
                                <div className="flex justify-between">
                                    <span className="font-semibold">{chat.name}</span>
                                    <span className="text-sm text-gray-500">{chat.time}</span>
                                </div>
                                <p className="text-sm text-gray-500">{chat.message}</p>
                            </div>

                            {chat.pinned && <span className="text-gray-400">📌</span>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;
