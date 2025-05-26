import { getMyConversations } from "@/apis/conversation.api";
import { fetchAcceptFriendRequests } from "@/apis/friend-request.api";
import { forwardMessage } from "@/apis/message.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Checkbox, Input, Modal, Tabs, message as antdMessage } from "antd";
import { useEffect, useMemo, useState } from "react";

const { Search, TextArea } = Input;

type ForwardModalProps = {
    open: boolean;
    messageToForward: any;
    onClose: () => void;
};

const ForwardModal = ({ open, messageToForward, onClose }: ForwardModalProps) => {
    const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const [tabKey, setTabKey] = useState<"recent" | "group" | "friend">("recent");

    const currentUserId = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("profile") || "{}")._id;
        } catch {
            return null;
        }
    }, []);

    // 📌 Query conversations
    const { data: conversationRes } = useQuery({
        queryKey: ["my-conversations"],
        queryFn: getMyConversations,
        enabled: open,
    });

    // 📌 Query friends
    const { data: friendRes } = useQuery({
        queryKey: ["my-friends"],
        queryFn: fetchAcceptFriendRequests,
        enabled: open,
    });

    const conversationList = conversationRes?.data?.data || [];
    const friendList = friendRes?.data?.data || [];

    const filteredConversations = useMemo(() => {
        const keyword = searchValue.toLowerCase();

        if (tabKey === "friend") {
            return friendList.filter((f: any) =>
                f.fullName?.toLowerCase().includes(keyword)
            );
        }

        return conversationList.filter((conv: any) => {
            if (tabKey === "group" && conv.type !== "group") return false;
            if (tabKey === "recent" && conv.type !== "group" && conv.type !== "single") return false;

            const user =
                conv.type === "single"
                    ? conv.participants.find((p: any) => p._id !== currentUserId)
                    : { fullName: conv.name };

            return user?.fullName?.toLowerCase().includes(keyword);
        });
    }, [searchValue, tabKey, conversationList, friendList]);

    const handleToggle = (id: string) => {
        setSelectedConversations((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const forwardMutation = useMutation({
        mutationFn: forwardMessage,
        onSuccess: () => {
            antdMessage.success("Chia sẻ thành công!");
            onClose();
            setSelectedConversations([]);
            setCustomMessage("");
        },
        onError: () => {
            antdMessage.error("Có lỗi xảy ra khi chia sẻ.");
        },
    });

    useEffect(() => {
        if (!open) {
            setSelectedConversations([]);
            setCustomMessage("");
            setSearchValue("");
            setTabKey("recent");
        }
    }, [open]);

    const renderConversationItem = (item: any) => {
        const convId = item._id;
        const user =
            tabKey === "friend"
                ? item
                : item.type === "single"
                    ? item.participants.find((p: any) => p._id !== currentUserId)
                    : { fullName: item.name, avatar: item.avatar };

        if (!user) return null;

        return (
            <div
                key={convId}
                className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                onClick={() => handleToggle(convId)}
            >
                <Checkbox checked={selectedConversations.includes(convId)} />
                <div className="relative w-12 h-12">
                    <div className="w-10 h-10 rounded-full border border-black bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-base overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            user.fullName
                                ?.split(" ")
                                .map((w: any) => w[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                        )}
                    </div>
                </div>
                <span className="truncate">{user.fullName}</span>
            </div>
        );
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title="Chia sẻ"
            onOk={() =>
                forwardMutation.mutate({
                    messageId: messageToForward._id,
                    targetConversationIds: selectedConversations,
                })
            }
            okText="Chia sẻ"
            okButtonProps={{
                disabled: !selectedConversations.length,
                loading: forwardMutation.isPending,
            }}
        >
            <Search
                placeholder="Tìm kiếm..."
                allowClear
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                className="mb-3"
            />

            <Tabs activeKey={tabKey} onChange={(key) => setTabKey(key as any)} className="mb-3">
                <Tabs.TabPane tab="Gần đây" key="recent">
                    <div className="max-h-[250px] overflow-y-auto space-y-2">
                        {filteredConversations.map(renderConversationItem)}
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Nhóm trò chuyện" key="group">
                    <div className="max-h-[250px] overflow-y-auto space-y-2">
                        {filteredConversations.map(renderConversationItem)}
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Bạn bè" key="friend">
                    <div className="max-h-[250px] overflow-y-auto space-y-2">
                        {filteredConversations.map(renderConversationItem)}
                    </div>
                </Tabs.TabPane>
            </Tabs>

            <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600 mb-2">
                <b>Chia sẻ tin nhắn</b>:{" "}
                {messageToForward?.type === "text"
                    ? messageToForward.content
                    : messageToForward?.type === "image"
                        ? "[Hình ảnh]"
                        : messageToForward?.type === "audio"
                            ? "[Âm thanh]"
                            : "[Tin nhắn]"}
            </div>

            <TextArea
                rows={3}
                placeholder="Nhập lời nhắn tuỳ chọn..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
            />
        </Modal>
    );
};

export default ForwardModal;
