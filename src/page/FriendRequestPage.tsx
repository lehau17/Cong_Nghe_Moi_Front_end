import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { useAcceptFriendRequest, usePendingFriendRequests, useRejectFriendRequest } from "@/queries/friend.query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Avatar, Spin } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const FriendRequestPage = () => {
    const [loadingId, setLoadingId] = useState<string | null>(null); // ID của request đang gọi API
    const { data, isLoading, refetch } = usePendingFriendRequests();

    // Mutation với callback khi thành công sẽ gọi lại API để refresh
    const acceptMutation = useAcceptFriendRequest({
        onMutate: (id) => setLoadingId(id), // Bắt đầu gọi API thì set loading
        onSuccess: () => {
            refetch();
            setLoadingId(null); // Xóa loading sau khi gọi xong
        },
        onError: () => setLoadingId(null), // Xóa loading nếu lỗi
    });

    const rejectMutation = useRejectFriendRequest({
        onMutate: (id) => setLoadingId(id),
        onSuccess: () => {
            refetch();
            setLoadingId(null);
        },
        onError: () => setLoadingId(null),
    });

    // Hàm xử lý Accept/Reject
    const handleAccept = (id: string) => {
        acceptMutation.mutate(id);
    };

    const handleReject = (id: string) => {
        rejectMutation.mutate(id);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header title="Lời mời kết bạn" />
            <div className="m-3 bg-white rounded-lg shadow p-4 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spin tip="Đang tải lời mời kết bạn..." />
                    </div>
                ) : (
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
