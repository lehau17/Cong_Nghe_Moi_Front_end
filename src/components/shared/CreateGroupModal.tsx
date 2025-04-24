import { createGroup } from "@/apis/conversation-group.api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAcceptedFriendRequests } from "@/queries/friend.query";
import { CameraFilled } from '@ant-design/icons';
import { useMutation } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function CreateGroupModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [sortOrder, _] = useState("A-Z");
    const [groupName, setGroupName] = useState("");

    const { data, isLoading } = useAcceptedFriendRequests(open);

    const friends = data?.data?.data || [];

    const createGroupMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            toast.success("Tạo nhóm thành công");
            onClose();
            setSelected([]);
            setGroupName("");
        },
        onError: () => {
            toast.error("Tạo nhóm thất bại");
        }
    });

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
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogTitle className="text-lg font-semibold pb-3 border-b-2">Tạo nhóm</DialogTitle>


                <div className="flex items-center justify-center gap-4">
                    <div className="border-b border-black rounded-full w-14 h-12 shadow-md flex items-center justify-center">
                        <CameraFilled size={30} />
                    </div>
                    <Input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Nhập tên nhóm..."
                        className="outline-none"
                    />
                </div>

                <div className="relative rounded-full border-2 flex items-center justify-center " >
                    <SearchIcon size={12} className="ml-4" />
                    <Input
                        placeholder="Nhập tên, số điện thoại, hoặc danh sách"
                        value={search}
                        className="border-none outline-none"

                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <IoClose
                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-lg text-gray-500"
                            onClick={() => setSearch("")}
                        />
                    )}
                </div>

                <div className="flex gap-2 text-sm mt-3 overflow-x-auto whitespace-nowrap">
                    <button className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">Tất cả</button>
                    <button className="px-2 py-1 rounded-full bg-gray-100">Khách hàng</button>
                    <button className="px-2 py-1 rounded-full bg-gray-100">Gia đình</button>
                    <button className="px-2 py-1 rounded-full bg-gray-100">Công việc</button>
                </div>

                <div className="mt-4 max-h-80 overflow-auto">
                    {isLoading ? (
                        <p className="text-sm text-gray-500">Đang tải...</p>
                    ) : (
                        groupedFriends.map(([letter, users]) => (
                            <div key={letter}>
                                <div className="p-5 font-bold text-gray-600 text-sm text-start">{letter}</div>
                                {users.map((friend) => {
                                    const isChecked = selected.includes(friend._id);

                                    return (
                                        <label
                                            key={friend._id}
                                            className="flex items-center px-5 py-3 cursor-pointer hover:bg-gray-100 w-full"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    setSelected((prev) =>
                                                        isChecked
                                                            ? prev.filter((id) => id !== friend._id)
                                                            : [...prev, friend._id]
                                                    );
                                                }}
                                                className="mr-3 accent-blue-500 w-4 h-4"
                                            />

                                            <div className="w-12 h-12 rounded-full border border-black bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
                                                {friend.avatar && friend.avatar !== "" ? (
                                                    <img
                                                        src={friend.avatar}
                                                        className="w-full h-full object-cover rounded-full"
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    friend.fullName
                                                        ?.split(" ")
                                                        .map((w: any) => w[0])
                                                        .join("")
                                                        .slice(0, 2)
                                                        .toUpperCase()
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <span className="text-sm font-semibold text-start">{friend.fullName}</span>
                                            </div>
                                        </label>
                                    );
                                })}

                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={onClose}>Hủy</button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        disabled={selected.length < 1 || !groupName.trim()}
                        onClick={() => {
                            createGroupMutation.mutate({
                                name: groupName,
                                members: selected,
                            });
                        }}
                    >
                        Tạo nhóm
                    </button>


                </div>
            </DialogContent>
        </Dialog>
    );
}
