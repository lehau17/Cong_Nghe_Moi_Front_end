import { acceptInvite, addMembersToGroup, getFriendsNotInGroup, getInvitesByGroup, leaveGroup, rejectInvite, removeMemberFromGroup, updateGroupMemberRole, updateRequireApproval } from "@/apis/conversation-group.api";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/context/ChatContext";
import { useUpdateGroupAvatar, useUpdateGroupName } from "@/hooks/useUpdateGroupAvatar";
import { useDisbandGroup } from "@/queries/conversation.query";
import { LeftOutlined, MoreOutlined, XOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Checkbox, Dropdown, Input, Menu, Switch } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "react-use";

interface Props {
    onClose: () => void;
    conversation: any;
    currentUserRole: string
}

const images = [
    "https://i.imgur.com/5MZocC4.png",
    "https://i.imgur.com/5MZocC4.png",
    "https://i.imgur.com/5MZocC4.png",
];

const ConversationInfoPanel = ({ onClose, conversation, currentUserRole = "member" }: Props) => {
    const { conversationList, setConversationId, setMessages, setActiveUser, setConversationList } = useChatContext();
    const currentUser = JSON.parse(localStorage.getItem("profile") || "{}");
    const currentUserId = currentUser._id;
    const isGroup = conversation?.type === "group";
    const [conversationData, setConversationData] = useState(conversation);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(conversationData.name || conversationData.participants.find((e: any) => e._id !== currentUserId)?.fullName);
    const { updateName } = useUpdateGroupName(conversation._id, (updatedName: string) => {
        setConversationData((prev: any) => ({ ...prev, name: updatedName, fullName: updatedName }));
        setIsEditingName(false);
    });
    const { handleClick, inputRef, handleChange } = useUpdateGroupAvatar(conversation._id, (newAvatar) => {
        setConversationData((prev: any) => ({ ...prev, avatar: newAvatar }));
    });
    type PanelView = "info" | "members" | "add-member" | "pending-approvals";
    const [panelView, setPanelView] = useState<PanelView>("info");

    const [searchText, setSearchText] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])



    const toggleRoleMutation = useMutation({
        mutationFn: async ({ groupId, userId, newRole }: { groupId: string, userId: string, newRole: "member" | "admin" }) => {
            return await updateGroupMemberRole(groupId, userId, newRole); // 👈 Tạo API này trong backend
        },
        onSuccess: (_, { groupId, userId, newRole }) => {
            toast.success("✅ Cập nhật quyền thành công!");

            setConversationList((prevList) => {
                return prevList.map((conv: any) => {
                    if (conv._id !== groupId) return conv;

                    return {
                        ...conv,
                        participants: conv.participants.map((p: any) =>
                            p._id === userId ? { ...p, role: newRole } : p
                        ),
                        updatedAt: new Date().toISOString(),
                    };
                });
            });
        },
        onError: () => {
            toast.error("❌ Cập nhật quyền thất bại");
        }
    });





    const { mutate: disband, isPending } = useDisbandGroup(() => {
        onClose(); // đóng panel nếu cần
        setConversationId(null)
        setMessages([])
        setActiveUser(null)
    });





    const removeMemberMutation = useMutation({
        mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
            removeMemberFromGroup(groupId, userId),
        onSuccess: () => {
            toast.success("🗑️ Đã xoá thành viên");
        },
        onError: () => {
            toast.error("❌ Không thể xoá thành viên");
        },
    });


    useDebounce(() => {
        setDebouncedSearch(searchText)
    }, 400, [searchText])


    const { data: friendsNotInGroup, isLoading } = useQuery({
        queryKey: ["friends-not-in-group", conversationData._id, debouncedSearch],
        queryFn: async () => getFriendsNotInGroup(conversationData._id),
        enabled: panelView === "add-member",
    });





    const leaveGroupMutation = useMutation({
        mutationFn: (groupId: string) => leaveGroup(groupId),
        onSuccess: () => {
            toast.success("🚪 Đã rời khỏi nhóm");
            setConversationId(null);
            setMessages([]);
            setActiveUser(null);
            onClose(); // đóng panel
        },
        onError: () => {
            toast.error("❌ Không thể rời khỏi nhóm");
        },
    });


    const addMembersMutation = useMutation({
        mutationFn: ({ groupId, userIds }: { groupId: string; userIds: string[] }) =>
            addMembersToGroup(groupId, userIds),
        onSuccess: (res) => {
            toast.success(res.data?.message || "Đã thêm thành viên");
            setSelectedMembers([]); // reset nếu cần
            setPanelView("info")
            // Có thể setPanelView("members") nếu muốn quay lại danh sách thành viên
        },
        onError: () => {
            toast.error("Thêm thành viên thất bại");
        },
    });


    const { data: pendingInvites, refetch: refetchInvites } = useQuery({
        queryKey: ["pending-invites", conversationData._id],
        queryFn: () => getInvitesByGroup(conversationData._id),
        enabled: panelView === "pending-approvals",
    });




    const acceptInviteMutation = useMutation({
        mutationFn: (inviteId: string) => acceptInvite(inviteId),
        onSuccess: () => {
            toast.success("✅ Đã chấp nhận thành viên");
            refetchInvites();
        },
        onError: () => toast.error("❌ Lỗi khi chấp nhận"),
    });

    const rejectInviteMutation = useMutation({
        mutationFn: (inviteId: string) => rejectInvite(inviteId),
        onSuccess: () => {
            toast.info("❌ Đã từ chối lời mời");
            refetchInvites();
        },
        onError: () => toast.error("❌ Lỗi khi từ chối"),
    });




    const [requireApproval, setRequireApproval] = useState<boolean>(conversationData.requireApproval || false);

    const updateApprovalSettingMutation = useMutation({
        mutationFn: async (_: boolean) => {
            // Gọi API update cờ requireApproval
            return await updateRequireApproval(conversationData._id);
        },
        onSuccess: (_, value) => {
            setRequireApproval(value);
            toast.success(`🎯 Đã ${value ? "bật" : "tắt"} duyệt thành viên`);
            setConversationData((prev: any) => ({ ...prev, requireApproval: value }));
        },
        onError: () => toast.error("❌ Không thể cập nhật cài đặt duyệt thành viên"),
    });



    const currentConv = conversationList.find((c: any) => c._id === conversationData._id);
    const participants = currentConv?.participants || [];
    // const otherUser = !isGroup
    //     ? currentConv?.participants?.find((p: any) => p._id !== currentUserId)
    //     : null;

    return (
        <div className="w-[360px] bg-white shadow-lg border-l h-full overflow-y-auto absolute right-0 top-0 z-40 flex flex-col">
            {/* Header */}
            <div className="relative min-h-[69px] border-b shadow-md flex items-center justify-center font-semibold text-[17px]">
                {panelView === "members" ? (
                    <LeftOutlined
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-lg cursor-pointer text-gray-500 hover:text-blue-500"
                        onClick={() => setPanelView("info")}
                    />
                ) : (
                    <XOutlined
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-lg cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={onClose}
                    />
                )}
                {panelView === "members" ? "Thành viên nhóm" : panelView === "add-member" ? "Thêm thành viên" : "Thông tin hội thoại"}
            </div>

            {/* Nếu đang ở panel members */}
            {panelView === "members" ? (
                <div className="space-y-3">
                    {participants.map((p: any) => (
                        <div
                            key={p._id}
                            className="flex items-center justify-between p-4 hover:bg-gray-200 rounded transition"
                        >
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={p.avatar || "https://via.placeholder.com/40"}
                                    alt={p.fullName}
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                <span className="text-sm font-semibold">{p.fullName}</span>
                                <span className="text-[10px] font-thin">{p.role}</span>
                            </div>

                            {/* Action dropdown */}
                            {p._id !== currentUserId && <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item key="view">👀 Xem thông tin</Menu.Item>
                                        <Menu.Item
                                            key="toggle-role"
                                            onClick={() =>
                                                toggleRoleMutation.mutate({
                                                    groupId: conversationData._id,
                                                    userId: p._id,
                                                    newRole: p.role === "admin" ? "member" : "admin"
                                                })
                                            }
                                        >
                                            {p.role === "admin" ? "⬇️ Hạ xuống member" : "⬆️ Nâng lên admin"}
                                        </Menu.Item>
                                        <Menu.Item
                                            key="remove"
                                            danger
                                            onClick={() =>
                                                removeMemberMutation.mutate({
                                                    groupId: conversationData._id,
                                                    userId: p._id,
                                                })
                                            }
                                        >
                                            🗑️ Xoá thành viên
                                        </Menu.Item>
                                    </Menu>

                                }
                                trigger={["click"]}
                                placement="bottomRight"
                            >
                                <MoreOutlined className="text-gray-600 cursor-pointer text-lg" />
                            </Dropdown>}

                        </div>
                    ))}
                    {currentUserRole === "owner" && (
                        <div className="px-4 pt-6">
                            <Button
                                className="w-full bg-red-500 hover:bg-red-600 text-white"
                                disabled={isPending}
                                onClick={() => {
                                    if (window.confirm("Bạn có chắc muốn giải tán nhóm này?")) {
                                        disband(conversationData._id);
                                    }
                                }}
                            >
                                🚨 Giải tán nhóm
                            </Button>
                        </div>
                    )}


                </div>

            ) : panelView === "add-member" ? (
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center border-b p-4 gap-2">
                        <LeftOutlined
                            className="text-gray-600 cursor-pointer"
                            onClick={() => setPanelView("info")}
                        />
                        <Input
                            placeholder="Tìm theo tên, số điện thoại..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
                        {isLoading ? (
                            <div className="text-sm text-gray-500">Đang tải...</div>
                        ) : (
                            friendsNotInGroup?.data?.data.map((user: any) => {
                                const isChecked = selectedMembers.includes(user._id);
                                return (
                                    <div key={user._id} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatar || "https://via.placeholder.com/40"}
                                                className="w-10 h-10 rounded-full border object-cover"
                                                alt="avatar"
                                            />
                                            <span className="text-sm">{user.fullName}</span>
                                        </div>
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={() =>
                                                setSelectedMembers(prev =>
                                                    isChecked
                                                        ? prev.filter(id => id !== user._id)
                                                        : [...prev, user._id]
                                                )
                                            }
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="p-4 border-t">
                        <Button
                            className="w-full"
                            disabled={!selectedMembers.length || addMembersMutation.isPending}
                            onClick={() => {
                                if (!conversationData?._id) return;
                                addMembersMutation.mutate({
                                    groupId: conversationData._id,
                                    userIds: selectedMembers,
                                });
                            }}
                        >
                            ➕ Thêm {selectedMembers.length} thành viên
                        </Button>
                    </div>

                </div>
            ) : panelView === "pending-approvals" ? (
                <div className="p-4 space-y-3">
                    {pendingInvites?.data
                        ?.filter((invite: any) => invite.status !== "accepted")
                        .map((invite: any) => (
                            <div
                                key={invite._id}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={invite.invitedUser.avatar || "https://via.placeholder.com/40"}
                                        className="w-10 h-10 rounded-full"
                                        alt="avatar"
                                    />
                                    <div>
                                        <div className="text-sm font-semibold">{invite.invitedUser.fullName}</div>
                                        <div className="text-xs text-gray-500">{invite.invitedUser.phoneNumber}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => acceptInviteMutation.mutate(invite._id)}>✔️ Đồng ý</Button>
                                    <Button variant="destructive" onClick={() => rejectInviteMutation.mutate(invite._id)}>❌ Từ chối</Button>
                                </div>
                            </div>
                        ))}
                </div>
            ) :
                (
                    <>
                        {/* Profile */}
                        <div className="flex flex-col items-center mt-5 px-4 border-b-4 pb-5">
                            <div className="relative w-20 h-20 border-2 rounded-full bg-gray-200 ">
                                {conversationData.avatar ? (
                                    <img src={conversationData.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold text-2xl">
                                        {conversationData.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                                    </div>
                                )}

                                {(currentUserRole === "owner" || currentUserRole === "admin") && (
                                    <>
                                        <button
                                            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow text-sm hover:text-blue-600"
                                            onClick={handleClick}
                                        >
                                            📷
                                        </button>
                                        <input
                                            ref={inputRef}
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                    </>
                                )}
                            </div>


                            <div className="mt-3 text-[16px] font-medium flex items-center gap-2">
                                {isEditingName ? (
                                    <>
                                        <input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={() => updateName(newName)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") updateName(newName);
                                                if (e.key === "Escape") setIsEditingName(false);
                                            }}
                                            autoFocus
                                            className="border px-2 py-1 text-sm rounded w-[160px]"
                                        />
                                    </>
                                ) : (
                                    <>
                                        {isGroup ? newName : newName || "Không rõ"}
                                        {isGroup && (currentUserRole === "owner" || currentUserRole === "admin") && (
                                            <button
                                                className="text-gray-500 hover:text-blue-500 text-sm"
                                                onClick={() => setIsEditingName(true)}
                                            >
                                                ✏️
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>


                            {isGroup && (
                                <div className="grid grid-cols-2 gap-2 mt-4 w-full text-sm">
                                    <button
                                        className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-400 transition"
                                        onClick={() => setPanelView("members")}
                                    >
                                        👥 Xem thành viên
                                    </button>
                                    <button className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-400 transition"
                                        onClick={() => setPanelView("add-member")}
                                    >
                                        ➕ Thêm thành viên
                                    </button>
                                    {currentUserRole === "owner" && requireApproval && (
                                        <button
                                            className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-400 transition"
                                            onClick={() => setPanelView("pending-approvals")}
                                        >
                                            🕒 Xem lời mời chờ duyệt
                                        </button>
                                    )}
                                    {currentUserRole !== "owner" && (
                                        <button
                                            className="bg-gray-100 col-span-2 px-3 py-2 rounded hover:bg-red-100 text-red-600 transition"
                                            onClick={() => {
                                                if (window.confirm("Bạn chắc chắn muốn rời khỏi nhóm này?")) {
                                                    leaveGroupMutation.mutate(conversationData._id);
                                                }
                                            }}
                                        >
                                            🚪 Rời nhóm
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4 mt-5 text-center text-sm">
                                <div className="flex flex-col items-center text-gray-600">
                                    <span className="text-xl">👥</span>
                                    <span>Tạo nhóm trò chuyện</span>
                                </div>
                            </div>
                        </div>

                        {/* Info List */}
                        <div className="mt-6 px-4 space-y-4 text-sm text-gray-700 border-b-4 pb-5">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🕒</span>
                                <span>Danh sách nhắc hẹn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">👥</span>
                                <span>7 nhóm chung</span>
                            </div>


                            <div className="flex items-center justify-between w-full px-4 mt-4">
                                <div className="flex flex-col text-sm text-gray-700">
                                    <span>🔒 Duyệt thành viên</span>
                                    <span className="text-xs text-gray-500">Chỉ owner mới có thể chỉnh</span>
                                </div>

                                {currentUserRole === "owner" && (
                                    <Switch
                                        checked={requireApproval}
                                        loading={updateApprovalSettingMutation.isPending}
                                        onChange={(checked) => updateApprovalSettingMutation.mutate(checked)}
                                    />
                                )}
                            </div>
                        </div>



                        {/* Media Section */}
                        <div className="mt-6 px-4 border-b-4 pb-5">
                            <div className="font-semibold text-sm mb-2 text-gray-800">Ảnh/Video</div>
                            <div className="grid grid-cols-3 gap-2">
                                {images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt="media"
                                        className="w-full h-20 object-cover rounded-md border"
                                    />
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full mt-3 text-blue-600 font-semibold hover:bg-gray-100"
                            >
                                Xem tất cả
                            </Button>
                        </div>

                        {/* Files Section */}
                        <div className="mt-6 pb-6">
                            <div className="font-semibold text-sm mb-2 text-gray-800">File</div>
                            <div className="flex flex-col gap-3 rounded-md cursor-pointer">
                                <div className="flex items-center hover:bg-gray-200 transition py-3 px-2">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/281/281760.png"
                                        alt="doc"
                                        className="w-8 h-8"
                                    />
                                    <span className="text-sm text-gray-700 truncate">CNM_Tuan2.docx</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </div>
    );
};

export default ConversationInfoPanel;
