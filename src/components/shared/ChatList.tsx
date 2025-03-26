import { FaUserPlus } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";

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
  return (
    <div className="w-90 bg-white h-screen flex flex-col border-r">
      {/* Header */}
      <div className="p-2 flex justify-between items-center border-b">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm"
          className="w-full bg-gray-100 px-2 py-2 rounded-lg outline-none"
        />
        <FaUserPlus className="text-gray-600 ml-3 cursor-pointer text-xl" />
        <IoMdMore className="text-gray-600 ml-3 cursor-pointer text-xl" />
      </div>

      {/* Tabs */}
      <div className="flex border-b px-4 text-gray-600 pt-3 text-sm">
        <div className="mr-4 font-semibold border-b-2 border-blue-600 pb-2 text-blue-600 ">
          Tất cả
        </div>
        <div className="mr-4 pb-2 cursor-pointer">Chưa đọc</div>
        <div className="ml-auto pb-2 cursor-pointer">Phân loại ▾</div>
      </div>

      {/* Chat Items */}
      <div className="overflow-auto flex-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${
              chat.highlighted ? "bg-blue-100" : ""
            }`}
          >
            {/* Avatar */}
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
                  {chat.unread && (
                    <span className="absolute bottom-0 right-0 bg-gray-300 text-xs px-1 rounded-full">
                      {chat.unread}+
                    </span>
                  )}
                </div>
              ) : (
                <img
                  src={chat.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 ml-3">
              <div className="flex justify-between">
                <span className="font-semibold">{chat.name}</span>
                <span className="text-sm text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-500">{chat.message}</p>
            </div>

            {/* Pinned */}
            {chat.pinned && <span className="text-gray-400">📌</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
