import Header from "@/components/shared/Header";
import ProfileModal from "@/components/shared/ProfileModel";
import { SocketContext } from "@/context/SocketContext";
import { useAcceptedFriendRequests, useDeleteFriendShip } from "@/queries/friend.query";
import { DashOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Menu, message, Modal, Select } from "antd";
import { useContext, useEffect, useState } from "react";

const FriendListPage = () => {
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("A-Z");
    const { mutate } = useDeleteFriendShip();
    const socket = useContext(SocketContext);
    const [openProfile, setOpenProfile] = useState<boolean>(false)
    const [userSelect, setUserSelect] = useState<string>('')

    const { data, refetch } = useAcceptedFriendRequests();

    const friends = data?.data?.data || [];

    // Filter + sort
    const filteredFriends = friends
        .filter((f) => f?.fullName?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) =>
            sortOrder === "A-Z"
                ? a?.fullName.localeCompare(b?.fullName)
                : b?.fullName.localeCompare(a?.fullName)
        );

    // Group by first letter
    const grouped: Record<string, any[]> = {};
    for (const friend of filteredFriends) {
        const letter = friend?.fullName.charAt(0).toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(friend);
    }

    const groupedFriends = Object.entries(grouped).sort(([a], [b]) =>
        sortOrder === "A-Z" ? a.localeCompare(b) : b.localeCompare(a)
    );

    // Handler actions
    const { confirm } = Modal;

    const handleMenuClick = (action: string, fs_id: string, friend_id: string) => {
        switch (action) {
            case "view_info":
                setUserSelect(friend_id)
                setOpenProfile(true)
                break;
            case "block_user":
                console.log(`Chặn người dùng ID: ${fs_id}`);
                break;
            case "remove_friend":
                showConfirmDelete(fs_id);
                break;
            default:
                break;
        }
    };


    const showConfirmDelete = (friendId: string) => {
        confirm({
            title: `Xác nhận huỷ kết bạn`,
            content: "Bạn có chắc chắn muốn huỷ kết bạn? Hành động này không thể hoàn tác.",
            okText: "Xác nhận",
            cancelText: "Huỷ",
            onOk() {
                return new Promise((resolve, reject) => {
                    mutate(friendId, {
                        onSuccess: () => {
                            message.success("Huỷ kết bạn thành công.");
                            resolve(true);
                        },
                        onError: () => {
                            message.error("Có lỗi xảy ra. Vui lòng thử lại.");
                            reject();
                        },
                    });
                });
            },
            onCancel() {
                console.log("Huỷ thao tác");
            },
        });
    };


    useEffect(() => {
        socket.on("delete-friendship", (_: string) => {
            refetch();
        });

        return () => {
            socket.off("delete-friendship");
        };
    }, [socket, refetch]);



    const renderMenu = (fs_id: string, friend_id: string) => (
        <Menu
            onClick={(e) => handleMenuClick(e.key, fs_id, friend_id)}
            items={[
                {
                    label: "Xem thông tin",
                    key: "view_info",
                },
                {
                    type: "divider" // Thêm dòng chia
                },
                {
                    label: (
                        <span style={{ color: "red" }}>
                            <ExclamationCircleOutlined style={{ marginRight: 5 }} />
                            Chặn người này
                        </span>
                    ),
                    key: "block_user",
                },
                {
                    label: (
                        <span style={{ color: "red" }}>
                            <ExclamationCircleOutlined style={{ marginRight: 5 }} />
                            Xóa kết bạn
                        </span>
                    ),
                    key: "remove_friend",
                },
            ]}
        />
    );


    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header title="Danh sách bạn bè" />
            <span className="m-3 text-sm text-start font-[550]">
                Bạn bè ({friends.length})
            </span>

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
                                key={friend._id}
                                className="flex items-center px-5 py-3 cursor-pointer hover:bg-gray-100"
                            >
                                <div className="w-12 h-12 rounded-full border-1 border-black bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                                    {friend.avatar && friend.avatar !== "" ? (
                                        <img src={friend.avatar} className="w-full h-full object-cover rounded-full" alt="avatar" />
                                    ) : (
                                        friend.fullName
                                            ?.split(" ")
                                            .map((w: any) => w[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()
                                    )}
                                </div>
                                <div className="flex items-center justify-between h-full w-full p-2">
                                    <span className="text-sm font-semibold text-start">{friend.fullName}</span>
                                    <Dropdown overlay={renderMenu(friend.fs_id, friend._id)} trigger={['click']}>
                                        <DashOutlined className="cursor-pointer" />
                                    </Dropdown>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <ProfileModal
                open={openProfile}
                onClose={() => setOpenProfile(false)}
                user={userSelect}
            />

        </div>
    );
};

export default FriendListPage;
