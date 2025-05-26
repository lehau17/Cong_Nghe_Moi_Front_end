import { createGroup } from "@/apis/conversation-group.api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAcceptedFriendRequests } from "@/queries/friend.query";
import { CameraFilled } from '@ant-design/icons';
import { useMutation } from "@tanstack/react-query";
import { Button } from "antd";
import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function CreateGroupModal({ open, onClose, userIds }: { open: boolean, onClose: () => void, userIds: string[] }) {
    const [selected, setSelected] = useState<string[]>(userIds);
    const [search, setSearch] = useState("");
    const [sortOrder, _] = useState("A-Z");
    const [groupName, setGroupName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
    const { data, isLoading } = useAcceptedFriendRequests(open);


    console.log("check select", selected)

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

    // Xử lý tạo nhóm với trạng thái loading
    const handleCreateGroup = () => {
        createGroupMutation.mutate({
            name: groupName,
            members: selected,
            avatar: groupAvatar as string
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogTitle className="text-lg font-semibold pb-3 border-b-2">Tạo nhóm</DialogTitle>

                <div className="flex items-center justify-center gap-4">
                    <div
                        className="border-b border-black rounded-full w-14 h-12 shadow-md flex items-center justify-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {groupAvatar ? (
                            <img
                                src={groupAvatar}
                                alt="Group Avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <CameraFilled size={20} />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append("file", file);

                                try {
                                    const res = await fetch("https://be.haudev.io.vn/api/upload", {
                                        method: "POST",
                                        body: formData,
                                    });

                                    const data = await res.json();
                                    if (res.ok && data.data.url) {
                                        setGroupAvatar(data.data.url);
                                    } else {
                                        throw new Error(data.message || "Lỗi upload");
                                    }
                                } catch (err) {
                                    toast.error("❌ Upload thất bại");
                                }
                            }}
                        />
                    </div>

                    <Input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Nhập tên nhóm..."
                        className="outline-none"
                    />
                </div>

                <div className="relative rounded-full border-2 flex items-center justify-center mt-4">
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
                    <Button className="mr-2" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        loading={createGroupMutation.isPending}
                        disabled={selected.length < 1 || !groupName.trim()}
                        onClick={handleCreateGroup}
                    >
                        Tạo nhóm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
