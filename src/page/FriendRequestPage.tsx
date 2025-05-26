import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { useAcceptFriendRequest, usePendingFriendRequests, useRejectFriendRequest } from "@/queries/friend.query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Avatar, Spin } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

// Trang này dùng để hiện thị danh sách lời mời kết bạn gửi đến mình
const FriendRequestPage = () => {
    // Trang thái loading khi gọi api
    // tránh để ngươì dùng spam api
    const [loadingId, setLoadingId] = useState<string | null>(null); // ID của request đang gọi API
    // Hàm lấy danh sách lời mời kết bạn được gửi đến mính
    // Dùng tanstack query với axios
    const { data, isLoading, refetch } = usePendingFriendRequests();

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

    // Hàm xử lý nếu nhấn nút chấp nhận lời mời kết bạn
    const handleAccept = (id: string) => {
        acceptMutation.mutate(id);
    };

    // Hàm xử lý nếu nhấn nút từ chối lời mời kết bạn
    const handleReject = (id: string) => {
        rejectMutation.mutate(id);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header title="Lời mời kết bạn" />
            <div className="m-3 bg-white rounded-lg shadow p-4 space-y-4">
                {/* Nếu api đang call có nghĩa là đang loading thì nó hiện chỗ này */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spin tip="Đang tải lời mời kết bạn..." />
                    </div>
                ) : (
                    // Nếu đã call API thành công thì hiện chỗ này
                    // data dạng mảng nêu cần quét qua mangr bằng map để hiện thị
                    data?.data.data.map((req) => (
                        <div
                            key={req._id}
                            className="flex items-center justify-between border-b pb-3"
                        >
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
                                {/* Nút chấp nhận lời mời kết bạn */}
                                <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => handleAccept(req.requestId)}
                                    disabled={loadingId === req.requestId} // Vô hiệu hóa khi đang loading
                                >
                                    {loadingId === req.requestId && acceptMutation.isPending ? (
                                        <Spin size="small" />
                                    ) : (
                                        <CheckOutlined />
                                    )}
                                </Button>
                                {/* Nút huỷ lời mời kết bạn */}
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
                )}
            </div>
        </div>
    );
};

export default FriendRequestPage;
