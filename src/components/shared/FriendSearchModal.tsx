import { sendFriendRequest } from "@/apis/friend-request.api";
import { searchUserByPhone, } from "@/apis/user.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
        onSuccess: () => toast.success("🎉 Đã gửi lời mời kết bạn!"),
        onError: () => toast.error("❌ Gửi lời mời thất bại!"),
    });


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[400px]">
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
                            <div className="cursor-pointer" onClick={() => {
                                onSelectUser(user);
                                onClose();
                            }}>
                                <p className="font-medium">{user.fullName}</p>
                                <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => friendRequestMutation.mutate(user._id)}
                                disabled={friendRequestMutation.isPending}
                            >
                                {friendRequestMutation.isPending ? "Đang gửi..." : "Kết bạn"}
                            </Button>
                        </div>
                    ) : debouncedPhone.length === 10 ? (
                        <p className="text-sm text-gray-500 italic">Không tìm thấy người dùng</p>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
