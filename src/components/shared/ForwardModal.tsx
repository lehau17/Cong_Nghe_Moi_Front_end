import { forwardMessage } from "@/apis/message.api";
import { useChatContext } from "@/context/ChatContext";
import { useMutation } from "@tanstack/react-query";
import { Checkbox, Input, Modal, Tabs, message as antdMessage } from "antd";
import { useEffect, useMemo, useState } from "react";

const { Search, TextArea } = Input;

type ForwardModalProps = {
    open: boolean;
    messageToForward: any;
    onClose: () => void;
};

const ForwardModal = ({ open, messageToForward, onClose }: ForwardModalProps) => {
    const { conversationList } = useChatContext();
    const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [customMessage, setCustomMessage] = useState("");

    const currentUserId = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("profile") || "{}")._id;
        } catch {
            return null;
        }
    }, []);

    const filteredConversations = useMemo(() => {
        return conversationList.filter((conv) => {
            const user = conv.participants.find(p => p._id !== currentUserId);
            return user?.fullName.toLowerCase().includes(searchValue.toLowerCase());
        });
    }, [searchValue, conversationList]);

    const handleToggle = (id: string) => {
        setSelectedConversations(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
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
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title="Chia sẻ"
            onOk={() =>
                forwardMutation.mutate({
                    messageId: messageToForward._id,
                    targetConversationIds: selectedConversations,
                    // customMessage
                })
            }
            okText="Chia sẻ"
            okButtonProps={{ disabled: !selectedConversations.length, loading: forwardMutation.isPending }}
        >

            <Search
                placeholder="Tìm kiếm..."
                allowClear
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                className="mb-3"
            />

            <Tabs defaultActiveKey="recent" className="mb-3">
                <Tabs.TabPane tab="Gần đây" key="recent">
                    <div className="max-h-[250px] overflow-y-auto space-y-2">
                        {filteredConversations.map((conv) => {
                            const user = conv.participants.find(p => p._id !== currentUserId);
                            if (!user) return null;

                            return (
                                <div
                                    key={conv._id}
                                    className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                                    onClick={() => handleToggle(conv._id)}
                                >
                                    <Checkbox checked={selectedConversations.includes(conv._id)} />
                                    <div className="relative w-12 h-12">
                                        <div className="w-10 h-10 rounded-full border-1 border-black bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-base">
                                            {user.avatar || user.avatar !== "" ? (
                                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                user.fullName
                                                    ?.split(" ")
                                                    .map((w) => w[0])
                                                    .join("")
                                                    .slice(0, 2)
                                                    .toUpperCase()
                                            )}
                                        </div>
                                    </div>
                                    <span className="truncate">{user.fullName}</span>
                                </div>
                            );
                        })}
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Nhóm trò chuyện" key="group" disabled />
                <Tabs.TabPane tab="Bạn bè" key="friend" disabled />
            </Tabs>

            <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600 mb-2">
                <b>Chia sẻ tin nhắn</b>: {messageToForward?.type === "text"
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
