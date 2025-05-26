import Header from "@/components/shared/Header";
import ProfileModal from "@/components/shared/ProfileModel";
import { Button } from "@/components/ui/button";
import { SocketContext } from "@/context/SocketContext";
import { useAcceptFriendRequest, useDeleteFriendShip, usePendingFriendRequests, useRejectFriendRequest, useSentFriendRequests } from "@/queries/friend.query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Avatar, Spin } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";

// Trang này dùng để hiện thị danh sách lời mời kết bạn gửi đến mình
const FriendRequestPage = () => {
    // Trang thái loading khi gọi api
    // tránh để ngươì dùng spam api
    const [loadingId, setLoadingId] = useState<string | null>(null); // ID của request đang gọi API
    // Hàm lấy danh sách lời mời kết bạn được gửi đến mính
    // Dùng tanstack query với axios
    const { data, refetch } = usePendingFriendRequests();
    const [filter, setFilter] = useState<string>("received");
    const socket = useContext(SocketContext)

    const [openProfile, setOpenProfile] = useState<boolean>(false)

    const [userSelect, setUserSelect] = useState<string>('')
    const { data: dataSent, refetch: refetchSend } = useSentFriendRequests()

    // Ham chấp nhập lời mời kết bạn
    // Dùng tanstack query với axios
    // cần id của cái lời mời kết bạn để chấp nhận
    const acceptMutation = useAcceptFriendRequest({
        onMutate: (id) => setLoadingId(id), // Bắt đầu gọi API thì set loading
        // Nếu thành công. Lấy lại danh sách lời mời kết bạn
        onSuccess: () => {
            refetch();
            setLoadingId(null); // Xóa loading sau khi gọi xong
        },
        // Lỗi thì tắt loading rồi bỏ qua :0
        onError: () => setLoadingId(null), // Xóa loading nếu lỗi
    });

    // Hàm từ chối lời mời kết bạn
    // Dùng tanstack query với axios
    // cần id của cái lời mời kết bạn để chấp nhận
    const rejectMutation = useRejectFriendRequest({
        onMutate: (id) => setLoadingId(id),
        // Nếu thành công. Lấy lại danh sách lời mời kết bạn
        onSuccess: () => {
            refetch();
            setLoadingId(null);
        },
        // Lỗi thì tắt loading rồi bỏ qua :0
        onError: () => setLoadingId(null),
    });


    const deleteMutation = useDeleteFriendShip({
        onMutate: (id) => setLoadingId(id),
        // Nếu thành công. Lấy lại danh sách lời mời kết bạn
        onSuccess: () => {
            setLoadingId(null);
        },
        // Lỗi thì tắt loading rồi bỏ qua :0
        onError: () => setLoadingId(null),
    });

    // Hàm xử lý nếu nhấn nút chấp nhận lời mời kết bạn
    const handleAccept = (id: string) => {
        acceptMutation.mutate(id);
    };

    // Hàm xử lý nếu nhấn nút từ chối lời mời kết bạn
    const handleReject = (id: string) => {
        rejectMutation.mutate(id);
    };


    useEffect(() => {
        socket.on("friend-removed", (_: any) => {
            refetchSend()
        })
    }, [])

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header title="Lời mời kết bạn" />
            <div className="m-3 bg-white rounded-lg shadow p-4 space-y-4">
                {/* Nếu api đang call có nghĩa là đang loading thì nó hiện chỗ này */}
                <div className="flex gap-2 mb-4">
                    <Button
                        variant={filter === "received" ? "default" : "outline"}
                        onClick={() => setFilter("received")}
                    >
                        Đã nhận
                    </Button>
                    <Button
                        variant={filter === "sent" ? "default" : "outline"}
                        onClick={() => setFilter("sent")}
                    >
                        Đã gửi
                    </Button>
                </div>


                {/* // Nếu đã call API thành công thì hiện chỗ này
                    // data dạng mảng nêu cần quét qua mangr bằng map để hiện thị */}
                {filter === "received" ? (
                    data?.data.data.map((req) => (
                        <div key={req._id} className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-3">
                                <Avatar size={48} src={req.user?.avatar}>
                                    {req.user?.fullName?.charAt(0).toUpperCase()}
                                </Avatar>
                                <div>
                                    <div className="font-semibold">{req.user?.fullName}</div>
                                    <div className="text-xs text-gray-500">
                                        Gửi lúc {dayjs(req.createdAt).format("HH:mm DD/MM/YYYY")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => handleAccept(req.requestId)}
                                    disabled={loadingId === req.requestId}
                                >
                                    {loadingId === req.requestId && acceptMutation.isPending ? (
                                        <Spin size="small" />
                                    ) : (
                                        <CheckOutlined />
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => handleReject(req.requestId)}
                                    disabled={loadingId === req.requestId}
                                >
                                    {loadingId === req._id && rejectMutation.isPending ? (
                                        <Spin size="small" />
                                    ) : (
                                        <CloseOutlined />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))
                ) : dataSent?.data?.data?.map((req) => (
                    <div
                        key={req._id}
                        className="flex items-center justify-between border-b pb-3"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar size={48} src={req.to?.avatar}>
                                {req.to?.fullName?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                                <div className="font-semibold">{req.to?.fullName}</div>
                                <div className="text-xs text-gray-500 text-start">
                                    Đã gửi lúc {dayjs(req.createdAt).format("HH:mm DD/MM/YYYY")}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Nút xem thông tin */}
                            <Button
                                size="sm"
                                variant="outline"
                                className="border border-gray-300"
                                onClick={() => {
                                    // TODO: mở modal thông tin user nếu cần
                                    setUserSelect(req.to._id)
                                    setOpenProfile(true)
                                }}
                            >
                                Xem thông tin
                            </Button>

                            {/* Nút huỷ lời mời kết bạn (chưa làm) */}
                            <Button
                                size="sm"
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => {
                                    // TODO: Gọi API huỷ lời mời kết bạn
                                    deleteMutation.mutateAsync(req._id)
                                    console.log("Huỷ lời mời gửi tới:", req._id);
                                }}
                            >
                                Huỷ lời mời
                            </Button>
                        </div>
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



export default FriendRequestPage;
