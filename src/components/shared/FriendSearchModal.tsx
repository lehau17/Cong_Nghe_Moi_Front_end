import { sendFriendRequest } from "@/apis/friend-request.api";
import { searchUserByPhone } from "@/apis/user.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAcceptFriendRequest, useDeleteFriendShip, useRejectFriendRequest } from "@/queries/friend.query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "react-use";

interface Props {
    open: boolean;
    onClose: () => void;
    onSelectUser: (user: any) => void;
}

export default function FriendSearchModal({ open, onClose, onSelectUser }: Props) {
    const [phone, setPhone] = useState("");
    const [debouncedPhone, setDebouncedPhone] = useState("");

    useDebounce(
        () => {
            setDebouncedPhone(phone);
        },
        500,
        [phone]
    );

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["searchUserByPhone", debouncedPhone],
        queryFn: () => searchUserByPhone(debouncedPhone),
        enabled: false,
    });

    const user = data?.data?.data;

    useEffect(() => {
        if (debouncedPhone.length === 10) {
            refetch();
        }
    }, [debouncedPhone]);

    const friendRequestMutation = useMutation({
        mutationFn: (userId: string) => sendFriendRequest(userId),
        onSuccess: () => {
            toast.success("🎉 Đã gửi lời mời kết bạn!")
            onClose()
        },
        onError: () => toast.error("❌ Gửi lời mời thất bại!"),
    });


    const cancelRequestMutation = useDeleteFriendShip({
        onSuccess: () => {
            toast.success("✅ Đã huỷ lời mời");
            onClose();
        },
        onError: () => toast.error("Huỷ lời mời thất bại"),
    });

    const acceptMutation = useAcceptFriendRequest({
        onSuccess: () => {
            toast.success("✅ Đã chấp nhận lời mời");
            onClose();
        },
        onError: () => toast.error("Chấp nhận lời mời thất bại"),
    });

    const rejectMutation = useRejectFriendRequest({
        onSuccess: () => {
            toast.success("🚫 Đã từ chối lời mời");
            onClose();
        },
        onError: () => toast.error("Từ chối lời mời thất bại"),
    });




    const renderActionButton = () => {
        if (!user || !user.rs_id) return null;

        if (user.relationship === "accepted") {
            return (
                <Button variant="outline" size="sm" disabled>
                    Đã là bạn bè
                </Button>
            );
        }

        if (user.relationship === "pending") {
            if (user.isSender) {
                // ✅ Mình là người gửi → Huỷ lời mời
                return (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelRequestMutation.mutate(user.rs_id)}
                        disabled={cancelRequestMutation.isPending}
                    >
                        {cancelRequestMutation.isPending ? "Đang huỷ..." : "Huỷ lời mời"}
                    </Button>
                );
            } else {
                // ✅ Mình là người nhận → Chấp nhận / Từ chối
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => acceptMutation.mutate(user.rs_id)}
                            disabled={acceptMutation.isPending}
                        >
                            {acceptMutation.isPending ? "Đang xử lý..." : "Chấp nhận"}
                        </Button>
                        <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => rejectMutation.mutate(user.rs_id)}
                            disabled={rejectMutation.isPending}
                        >
                            {rejectMutation.isPending ? "..." : "Từ chối"}
                        </Button>
                    </div>
                );
            }
        }

        // ✅ Chưa có quan hệ → Gửi lời mời
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={() => friendRequestMutation.mutate(user._id)}
                disabled={friendRequestMutation.isPending}
            >
                {friendRequestMutation.isPending ? "Đang gửi..." : "Kết bạn"}
            </Button>
        );
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tìm bạn qua số điện thoại</DialogTitle>
                </DialogHeader>
                <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại (10 số)"
                />
                <div className="mt-4">
                    {isFetching ? (
                        <p className="text-sm text-gray-400">Đang tìm kiếm...</p>
                    ) : user ? (
                        <div className="flex justify-between items-center border p-3 rounded-md hover:bg-gray-50">
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    onSelectUser(user);
                                    onClose();
                                }}
                            >
                                <p className="font-medium">{user.fullName}</p>
                                <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                            </div>
                            {renderActionButton()}
                        </div>
                    ) : debouncedPhone.length === 10 ? (
                        <p className="text-sm text-gray-500 italic">Không tìm thấy người dùng</p>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
