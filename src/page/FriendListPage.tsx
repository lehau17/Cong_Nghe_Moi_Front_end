import Header from "@/components/shared/Header";
import { DashOutlined, FilterFilled, SearchOutlined, SwapOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import { useState } from "react";

const friends = [
  { id: 1, name: "Anh Thư", avatar: "https://via.placeholder.com/40" },
  { id: 2, name: "Cẩm Tú", avatar: "https://via.placeholder.com/40" },
  { id: 3, name: "Duc", avatar: "https://via.placeholder.com/40" },
  { id: 4, name: "Fuckboiz vạn gái mê", avatar: "https://via.placeholder.com/40" },
  { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
  { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
  { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
  { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
  { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
  { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
  { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
  { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
];

const FriendListPage = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");

  const filteredFriends = friends
    .filter((friend) => friend.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "A-Z" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Phần danh sách tin nhắn - cuộn được */}
            <Header title="Danh sách bạn bè"/>
        <span className="m-3 text-sm text-start font-[550]">Bạn bè (46)</span>
        <div className="bg-white  rounded-lg shadow m-3 mt-0">
        <div className="flex gap-4 mb-4 p-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm bạn"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Select
                        defaultValue="A-Z"
                        prefix={<SwapOutlined/>}
            onChange={setSortOrder}
            options={[
              { value: "A-Z", label: "Tên (A-Z)" },
              { value: "Z-A", label: "Tên (Z-A)" },
            ]}
            className="w-70 text-start"
          />
                    <Select
                        prefix={<FilterFilled/>}
                        defaultValue="Tất cả" options={[{ value: "all", label: "Tất cả" }]} className="w-70 text-start" />
        </div>
        <div>
          {filteredFriends.map((friend, index) => (
            <div key={friend.id} className="flex items-center px-4 gap-4 cursor-pointer hover:bg-gray-200    ">
                  <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full border" />
                  <div className="flex items-center justify-between h-full w-full border-b p-2">
                        <span className="text-sm font-semibold   text-start  py-4">{friend.name}</span>
                        <DashOutlined />
                  </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendListPage;

