import Header from "@/components/shared/Header";
import ProfileModal from "@/components/shared/ProfileModel";
import { SocketContext } from "@/context/SocketContext";
import { useAcceptedFriendRequests, useDeleteFriendShip } from "@/queries/friend.query";
import { DashOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Menu, message, Modal, Select } from "antd";
import { useContext, useEffect, useState } from "react";

const FriendListPage = () => {
    // dùng để lưu nội dung search tìm kiếm
    // có 2 biến là search và setSearch. biến `search` dùng để lưu thông tin tìm kiếm
    // hàm setSeach dùng để cập nhật thay đổi
    // Nếu người dùng nhập nội dung timf kiếm. gọi hàm setSearch để cập nhật search
    const [search, setSearch] = useState("");
    // dùng để xắp xếp theo tên người dùng
    // mặt định là từ A-Z
    // có 2 loại là A-Z và Z-A
    // nếu muốn thay đổi cách sắp xếp thì gọi hàm setSortOrder
    const [sortOrder, setSortOrder] = useState("A-Z");
    // tanstack query kết hợp axios để call api huỷ bạn bè
    const { mutate } = useDeleteFriendShip();
    // socket IO
    const socket = useContext(SocketContext);
    // dùng để mở model profile.
    // giá trị mạt định là false sẽ không hiện
    // muốn hiển thị model thì sẽ gọi hàm setOpenProfile chuyển nó thành true.
    // khi true thì model sẽ mở
    // tắt model thì gọi hàm setOpenProfile gắn nó là false
    const [openProfile, setOpenProfile] = useState<boolean>(false)

    const [userSelect, setUserSelect] = useState<string>('')

    // lấy danh sách bạn bè
    // dùng tanstack query với axios
    const { data, refetch } = useAcceptedFriendRequests();
    const friends = data?.data?.data || [];

    // Filter + sort
    // săp xêps danh sách bạn bè từ A-Z
    const filteredFriends = friends
        .filter((f) => f?.fullName?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) =>
            sortOrder === "A-Z"
                ? a?.fullName.localeCompare(b?.fullName)
                : b?.fullName.localeCompare(a?.fullName)
        );

    // Group by first letter
    // gom nhóm các bạn bè lại theo chữ cái đầu trong tên
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


    // các lựa chọn trong menu con
    // chọn caí nào thì xử lý cái đó
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

    // khi nhấn huyr kết bạn gọi hàm này
    // sẽ hiển thị lên 1 cái giao diện bạn có chắc muốn xoá bạn bè không
    // chọn oke thì sẽ call api huỷ kết bạn
    const showConfirmDelete = (friendId: string) => {
        confirm({
            title: `Xác nhận huỷ kết bạn`,
            content: "Bạn có chắc chắn muốn huỷ kết bạn? Hành động này không thể hoàn tác.",
            okText: "Xác nhận",
            cancelText: "Huỷ",
            // nếu châp nhận kết bạn sẽ gọi hàm onOK
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
            // Khi từ chối gọi hàm này
            onCancel() {
                console.log("Huỷ thao tác");
            },
        });
    };

    // bắt sự kiện websocket
    useEffect(() => {
        // khi socket nhận được sự kiện `delete-friendship`
        // call lại api bằng hàm refetch
        // hàm này có tác dụng call laị api
        socket.on("delete-friendship", (_: string) => {
            refetch();
        });


        // hàm này là hàm clean.
        // có nghĩa là nếu thoát khỏi giao diện này cần huỷ hứng sự kiện
        return () => {
            socket.off("delete-friendship");
        };
    }, [socket, refetch]);


    // Hàm dùng để hiển thị Menu khi chọn vào ... bên danh sách bạn bè
    const renderMenu = (fs_id: string, friend_id: string) => (
        <Menu
            // khi nhấn vào 1 cái item trong menu thì gọi hàm này
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

    // Giao diện
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
