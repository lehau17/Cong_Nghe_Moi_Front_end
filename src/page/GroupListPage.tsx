import { groupApi } from "@/apis/group.api";
import Header from "@/components/shared/Header";
import { SocketContext } from "@/context/SocketContext";
import { useDeleteFriendShip } from "@/queries/friend.query";
import { DashOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Dropdown, Input, Menu, message, Modal, Select } from "antd";
import { useContext, useEffect, useState } from "react";

const GroupListPage = () => {
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

    // lấy danh sách bạn bè
    // dùng tanstack query với axios
    const { data, refetch } = useQuery({
        queryKey: ["groupList"],
        queryFn: () => groupApi.getMyGroups(), // Gọi tới /api/conversationGroup/me
    });
    const groups = data?.data?.data || [];
    // Filter + sort
    // săp xêps danh sách bạn bè từ A-Z
    const filteredFriends = groups
        .filter((f: any) => f?.name?.toLowerCase().includes(search.toLowerCase()))
        .sort((a: any, b: any) =>
            sortOrder === "A-Z"
                ? a?.name.localeCompare(b?.name)
                : b?.name.localeCompare(a?.name)
        );

    // Group by first letter
    // gom nhóm các bạn bè lại theo chữ cái đầu trong tên
    const grouped: Record<string, any[]> = {};
    for (const friend of filteredFriends) {
        const letter = friend?.name.charAt(0).toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(friend);
    }

    const groupedFriends = Object.entries(grouped).sort(([a], [b]) =>
        sortOrder === "A-Z" ? a.localeCompare(b) : b.localeCompare(a)
    );

    console.log(groupedFriends)

    // Handler actions
    const { confirm } = Modal;


    // các lựa chọn trong menu con
    // chọn caí nào thì xử lý cái đó
    const handleMenuClick = (action: string, fs_id: string, friend_id?: string) => {
        console.log(action, fs_id, friend_id)
        // switch (action) {
        //     case "view_info":
        //         setUserSelect(friend_id!)
        //         setOpenProfile(true)
        //         break;
        //     case "block_user":
        //         console.log(`Chặn người dùng ID: ${fs_id}`);
        //         break;
        //     case "remove_friend":
        //         showConfirmDelete(fs_id);
        //         break;
        //     default:
        //         break;
        // }
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

    console.log(showConfirmDelete)

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
    const renderMenu = (group_id: string) => (
        <Menu
            onClick={(e) => handleMenuClick(e.key, group_id, "")}
            items={[
                { label: "Xem thông tin nhóm", key: "view_info" },
                { type: "divider" },
                {
                    label: (
                        <span style={{ color: "red" }}>
                            <ExclamationCircleOutlined style={{ marginRight: 5 }} />
                            Rời nhóm
                        </span>
                    ),
                    key: "leave_group",
                },
            ]}
        />
    );


    // Giao diện
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header title="Danh sách nhóm" />
            <span className="m-3 text-sm text-start font-[550]">
                Nhóm ({groups.length})
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

                {groupedFriends.map(([letter, groups]) => (
                    <div key={letter}>
                        <div className="p-5 font-bold text-gray-600 text-sm text-start">{letter}</div>
                        {groups.map((group: any) => (
                            <div
                                key={group._id}
                                className="flex items-center px-5 py-3 cursor-pointer hover:bg-gray-100"
                            >
                                <div className="w-12 h-12 rounded-full border bg-gray-200 flex items-center justify-center">
                                    {group.avatar ? (
                                        <img src={group.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        group.name
                                            .split(" ")
                                            .map((word: string) => word[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()
                                    )}
                                </div>
                                <div className="flex items-center justify-between h-full w-full p-2">
                                    <span className="text-sm font-semibold text-start">{group.name}</span>
                                    <Dropdown overlay={renderMenu(group._id)} trigger={['click']}>
                                        <DashOutlined className="cursor-pointer" />
                                    </Dropdown>
                                </div>
                            </div>
                        ))}

                    </div>
                ))}
            </div>


        </div>
    );
};

export default GroupListPage;
