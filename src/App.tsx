import { useQuery } from '@tanstack/react-query';
import { Modal } from "antd";
import { useContext, useEffect, useRef } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMyConversations } from './apis/conversation.api';
import { getUserProfile, getUserProfileById } from './apis/user.api';
import './App.css';
import CallUI from './components/shared/CallUI';
import { useCallContext } from './context/CallContext';
import { useChatContext } from './context/ChatContext';
import { SocketContext } from './context/SocketContext';
import { getAccessTokenFromLS } from './lib/auth';
import AppRouter from './router';
import { agoraService } from './services/agoraService';
import { Conversation } from './types/conversation';


function App() {
    const socket = useContext(SocketContext);
    const { setShowCallUI, setCallInfo } = useCallContext();
    const conversationListRef = useRef<Conversation[]>([]);



    const { appendMessage, setMessages, conversationId, setConversationId, updateConversationList, conversationList, setConversationList } = useChatContext()
    const { refetch: refetchUserProfile } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        enabled: false,
    });
    const { refetch } = useQuery({
        queryKey: ["myConversations"],
        queryFn: getMyConversations,
    });



    conversationListRef.current = conversationList;



    useEffect(() => {
        const handleNewMessage = (msg: any) => {
            if (msg.conversationId === conversationId) {
                appendMessage(msg);
            }
        };

        socket.on("new-message", handleNewMessage);


        // socket.on("emoji-updated", (updatedMessage) => {
        //     if (updatedMessage.conversationId !== conversationId) return
        //     setMessages(prev =>
        //         prev.map(m => m._id === updatedMessage._id ? { ...m, ...updatedMessage } : m)
        //     );
        // });


        socket.on("message-recalled", (updatedMessage) => {

            console.log("=>>> Recall Message : >>>", updatedMessage)
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg._id === updatedMessage._id ? { ...msg, ...updatedMessage } : msg
                )
            );


            setConversationList((prevList) =>
                prevList.map((conv) => {
                    if (conv._id !== updatedMessage.conversationId) return conv;

                    if (conv.lastMessage && conv.lastMessage._id === updatedMessage._id) {
                        return {
                            ...conv,
                            lastMessage: {
                                ...conv.lastMessage,
                                ...updatedMessage,
                                sender: {
                                    ...updatedMessage.sender,
                                    label: updatedMessage.sender.fullName.trim().split(" ").pop() || "Người lạ"

                                }
                            },
                            updatedAt: new Date().toISOString(),
                        };
                    }

                    return conv;
                })
            );
        });


        return () => {
            socket.off("new-message", handleNewMessage);
        };
    }, [conversationId]);
    useEffect(() => {
        const accessToken = getAccessTokenFromLS();
        if (accessToken) {
            refetch().then((data) => {
                setConversationList(data.data?.data.data as Conversation[])
            })
            refetchUserProfile()
                .then((result) => {
                    if (result.isSuccess && result.data) {
                        // 👇 Gắn token + connect + emit
                        socket.auth = { token: accessToken };
                        socket.connect();
                        socket.on("connect", () => {
                            // console.log("✅ Socket connected & registered");
                            socket.emit("register", result.data.data.data._id);
                        });
                        socket.on("friend-request", (data) => {
                            toast.info(`${data.from.fullName} đã gửi lời mời kết bạn!`);
                        });

                        socket.on("update-chat-list", (data: Conversation) => {
                            console.log("test update chat list")
                            updateConversationList(data)
                        })


                        socket.on("group:deleted", ({ groupId }) => {
                            setConversationList((prev) => prev.filter(conv => conv._id !== groupId));

                            if (conversationId === groupId) {
                                setConversationId(null);
                                toast.info("🚫 Nhóm đã bị giải tán");
                            }
                        });


                        socket.on("group:member-added-group", async ({ groupId, addedUserIds, addedBy: _ }) => {
                            const currentUserId = result.data.data.data._id;

                            const existingConv = conversationListRef.current.find((c) => c._id === groupId);
                            if (!existingConv) return;

                            const newProfiles = await Promise.all(
                                addedUserIds.map((userId: string) => getUserProfileById(userId).then(res => res.data.data))
                            );


                            setConversationList(prev =>
                                prev.map(conv => {
                                    if (conv._id !== groupId) return conv;

                                    const currentIds = conv.participants.map(p => p._id);
                                    const newParticipants = newProfiles.filter(p => !currentIds.includes(p._id));

                                    return {
                                        ...conv,
                                        participants: [
                                            ...conv.participants,
                                            ...newParticipants.map(p => ({
                                                ...p,
                                                label: p.fullName.trim().split(" ").pop() || "Người lạ"
                                            }))
                                        ],
                                        updatedAt: new Date().toISOString()
                                    };
                                })
                            );

                            // Nếu user là người được thêm, hiện toast
                            if (addedUserIds.includes(currentUserId)) {
                                toast.success("Bạn vừa được thêm vào nhóm mới!");
                            }
                        });



                        socket.on("group:member-added", async ({ groupId, addedUserId, addedBy: _ }) => {
                            try {
                                const { data } = await getUserProfileById(addedUserId);

                                const existingConv = conversationListRef.current.find((conv) => conv._id === groupId);
                                if (!existingConv) return;

                                const isExisted = existingConv.participants.some(p => p._id === addedUserId);
                                if (isExisted) return;

                                const updatedConv: Conversation = {
                                    ...existingConv,
                                    participants: [
                                        ...existingConv.participants,
                                        {
                                            ...data.data,
                                        }
                                    ],
                                    updatedAt: new Date().toISOString()
                                };

                                updateConversationList(updatedConv);

                                toast.success(`${data.data.fullName} đã được thêm vào nhóm`);
                            } catch (err) {
                                console.error("❌ Lỗi khi fetch thông tin user:", err);
                            }
                        });





                        socket.on("group:member-removed", ({ groupId, removedUserId, removedBy: _ }) => {
                            console.log("remove member", groupId, removedUserId)
                            const currentUserId = result.data.data.data._id;

                            if (removedUserId === currentUserId) {
                                console.log("fix")
                                toast.info("Bạn đã bị xoá khỏi nhóm");

                                // Nếu đang mở cuộc trò chuyện đó thì clear
                                if (conversationId === groupId) {
                                    setConversationId(null)
                                    // Có thể gọi setConversationId(null) hoặc chuyển sang màn hình khác
                                }

                                return;
                            }

                            // Nếu không phải mình bị xoá thì update lại danh sách participants
                            const existingConv = conversationListRef.current.find((c) => c._id === groupId);
                            if (!existingConv) return;

                            const updatedParticipants = existingConv.participants.filter((p) => p._id !== removedUserId);

                            const updatedConversation = {
                                ...existingConv,
                                participants: updatedParticipants,
                                updatedAt: new Date().toISOString(),
                            };

                            updateConversationList(updatedConversation);
                        });


                        socket.on("group:memberLeft", ({ groupId, leftUserId }) => {
                            const currentUserId = result.data.data.data._id;
                            if (leftUserId === currentUserId) {
                                toast.info("🚪 Bạn đã rời khỏi nhóm");

                                setConversationList(prev => prev.filter(conv => conv._id !== groupId));
                                if (conversationId === groupId) {
                                    setConversationId(null);
                                }
                                return;
                            }

                            // Nếu người khác rời nhóm thì update lại danh sách participant
                            const existingConv = conversationListRef.current.find(conv => conv._id === groupId);
                            if (!existingConv) return;

                            const updatedConv = {
                                ...existingConv,
                                participants: existingConv.participants.filter(p => p._id !== leftUserId),
                                updatedAt: new Date().toISOString(),
                            };

                            updateConversationList(updatedConv);
                            toast.info("Một thành viên đã rời khỏi nhóm");
                        });




                        socket.on("groupCreated", ({ group, message }) => {
                            console.log("test groips", group)
                            const formattedGroup = {
                                _id: group._id,
                                type: "group",
                                name: group.name,
                                avatar: group.avatar,
                                participants: group.participants.map((p: any) => ({
                                    _id: p.user._id,
                                    fullName: p.user.fullName,
                                    avatar: p.user.avatar,
                                    phoneNumber: p.user.phoneNumber,
                                    role: p.role,
                                    label: p.user.fullName?.trim().split(" ").pop() || "Người lạ",
                                })),
                                lastMessage: {
                                    _id: message._id,
                                    conversationId: message.conversationId,
                                    sender: {
                                        _id: message.sender._id,
                                        fullName: message.sender.fullName,
                                        avatar: message.sender.avatar,
                                        phoneNumber: message.sender.phoneNumber,
                                        label: message.sender.fullName?.trim().split(" ").pop() || "Người lạ",
                                    },
                                    type: message.type,
                                    content: message.content,
                                    isRead: false,
                                    readAt: null,
                                    createdAt: message.createdAt,
                                    updatedAt: message.updatedAt,
                                    fileMeta: [],
                                },
                                createdAt: group.createdAt,
                                updatedAt: group.updatedAt,
                            };


                            updateConversationList(formattedGroup); // hoặc thêm vào state, ví dụ setConversationList([...prev, formatted])
                        });


                        socket.on("incoming-call", ({ from, conversationId, token }) => {
                            setCallInfo({
                                channelId: conversationId,
                                token,
                                conversationId, // 👈 Set luôn ở đây
                            });
                            Modal.confirm({
                                title: `${from.fullName} đang gọi đến`,
                                content: "Bạn có muốn trả lời cuộc gọi không?",
                                okText: "Trả lời",
                                cancelText: "Từ chối",
                                onCancel: async () => {
                                    try {
                                        await agoraService.leaveChannel(); // Leave nếu đã vào rồi
                                    } catch (err) {
                                        console.warn("Không cần leave vì chưa vào channel");
                                    }
                                    socket.emit("decline-call", {
                                        to: from._id,
                                        conversationId,
                                    });
                                },

                                onOk: async () => {
                                    console.log('check data in receive call', result.data.data.data._id)
                                    const { videoTrack } = await agoraService.joinChannel(conversationId, token, result.data.data.data._id);
                                    setShowCallUI(true);
                                    setTimeout(() => {
                                        videoTrack.play("video-container");
                                    }, 100);
                                },
                            });
                        });

                        socket.on("call-declined", ({ reason }) => {
                            Modal.info({
                                title: "Cuộc gọi bị từ chối",
                                content: reason || "Người nhận không sẵn sàng nhận cuộc gọi.",
                            });
                            setShowCallUI(false);

                            // agoraService.leaveChannel()
                        });


                        socket.on("end-call", ({ }) => {
                            // Nếu đang trong cuộc gọi này thì rời khỏi kênh + đóng UI
                            agoraService.leaveChannel();
                            setShowCallUI(false);
                        });



                    } else {
                        console.warn("⚠️ Không lấy được thông tin user");
                    }
                })
                .catch((err) => {
                    console.error("❌ Lỗi khi lấy user profile:", err);
                    // 👉 TODO: nếu cần logout, clear token tại đây
                    localStorage.removeItem("access_token");
                    socket.disconnect();
                });
        }

        socket.on("connect_error", (err) => {
            console.error("❌ Connect error:", err.message);
        });


        return () => {
            socket.off("friend-request");
            socket.disconnect(); // cleanup khi unmount
        };
    }, []);

    return (
        <>
            <ToastContainer
                position="top-right" // Vị trí hiển thị
                autoClose={3000} // Tự động đóng sau 3 giây
                hideProgressBar={false} // Hiển thị thanh tiến trình
                newestOnTop={true} // Hiển thị thông báo mới nhất lên đầu
                closeOnClick // Đóng toast khi click vào
                rtl={false} // Không bật chế độ RTL (Right to Left)
                pauseOnFocusLoss // Dừng khi mất focus cửa sổ
                draggable // Có thể kéo thả toast
                pauseOnHover // Dừng khi hover vào
                theme="light" // Chủ đề: "light", "dark", "colored"
            />
            <AppRouter />

            <CallUI />

        </>
    )
}

export default App
