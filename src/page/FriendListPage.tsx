import Header from "@/components/shared/Header";
import { DashOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import { useMemo, useState } from "react";

const friends = [
    { id: 1, name: "Anh Thư", avatar: "https://via.placeholder.com/40" },
    { id: 2, name: "Cẩm Tú", avatar: "https://via.placeholder.com/40" },
    { id: 3, name: "Duc", avatar: "https://via.placeholder.com/40" },
    { id: 4, name: "Fuckboiz vạn gái mê", avatar: "https://via.placeholder.com/40" },
    { id: 5, name: "Hiền Nguyễn", avatar: "https://via.placeholder.com/40" },
    { id: 6, name: "Bảo Lộc", avatar: "https://via.placeholder.com/40" },
    { id: 7, name: "Đức Bùi", avatar: "https://via.placeholder.com/40" },
];

const FriendListPage = () => {
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("A-Z");

    const groupedFriends = useMemo(() => {
        const filtered = friends
            .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) =>
                sortOrder === "A-Z" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            );

        const grouped: Record<string, typeof friends> = {};
        for (const friend of filtered) {
            const letter = friend.name.charAt(0).toUpperCase();
            if (!grouped[letter]) grouped[letter] = [];
            grouped[letter].push(friend);
        }

        return Object.entries(grouped).sort(([a], [b]) =>
            sortOrder === "A-Z" ? a.localeCompare(b) : b.localeCompare(a)
        );
    }, [search, sortOrder]);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header title="Danh sách bạn bè" />
            <span className="m-3 text-sm text-start font-[550]">Bạn bè ({friends.length})</span>

            <div className="bg-white rounded-lg shadow m-3 mt-0">
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
                        onChange={setSortOrder}
                        options={[
                            { value: "A-Z", label: "Tên (A-Z)" },
                            { value: "Z-A", label: "Tên (Z-A)" },
                        ]}
                        className="w-[150px] text-start"
                    />
                    <Select
                        defaultValue="all"
                        options={[{ value: "all", label: "Tất cả" }]}
                        className="w-[150px] text-start"
                    />
                </div>

                {groupedFriends.map(([letter, users]) => (
                    <div key={letter}>
                        <div className="p-5 font-bold text-gray-600 text-sm text-start">{letter}</div>
                        {users.map((friend) => (
                            <div
                                key={friend.id}
                                className="flex items-center px-5 py-3 gap-4 cursor-pointer hover:bg-gray-100"
                            >
                                <img
                                    src={friend.avatar}
                                    alt={friend.name}
                                    className="w-12 h-12 rounded-full border"
                                />
                                <div className="flex items-center justify-between h-full w-full p-2">
                                    <span className="text-sm font-semibold text-start">{friend.name}</span>
                                    <DashOutlined />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendListPage;
