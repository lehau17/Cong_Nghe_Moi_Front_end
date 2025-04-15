import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { useAcceptFriendRequest, usePendingFriendRequests, useRejectFriendRequest } from "@/queries/friend.query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import dayjs from "dayjs";

const FriendRequestPage = () => {
    const { data, isLoading, refetch } = usePendingFriendRequests();
    const acceptMutation = useAcceptFriendRequest({ onSuccess: refetch });
    const rejectMutation = useRejectFriendRequest({ onSuccess: refetch });

    const handleAccept = (id: string) => acceptMutation.mutate(id);
    const handleReject = (id: string) => rejectMutation.mutate(id);


    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header title="Lời mời kết bạn" />
            <div className="m-3 bg-white rounded-lg shadow p-4 space-y-4">
                {isLoading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : (
                    data?.data.data.map((req) => (
                        <div
                            key={req._id}
                            className="flex items-center justify-between border-b pb-3"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar size={48} src={req.from.avatar} />
                                <div>
                                    <div className="font-semibold">{req.from.fullName}</div>
                                    <div className="text-xs text-gray-500">
                                        Gửi lúc {dayjs(req.createdAt).format("HH:mm DD/MM/YYYY")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => handleAccept(req._id)}
                                >
                                    <CheckOutlined />
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => handleReject(req._id)}
                                >
                                    <CloseOutlined />
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
