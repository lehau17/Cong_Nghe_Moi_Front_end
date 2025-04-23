import { useQuery } from '@tanstack/react-query';
import { Modal } from "antd";
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMyConversations } from './apis/conversation.api';
import { getUserProfile } from './apis/user.api';
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


    const { appendMessage, conversationId, updateConversationList, setConversationList } = useChatContext()
    const { refetch: refetchUserProfile } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        enabled: false,
    });
    const { refetch } = useQuery({
        queryKey: ["myConversations"],
        queryFn: getMyConversations,
    });


    useEffect(() => {
        const handleNewMessage = (msg: any) => {
            console.log("check", msg, conversationId)
            if (msg.conversationId === conversationId) {
                appendMessage(msg);
                refetch().then(e => {
                    console.log(e)
                    // setConversationList(e.data?.data.data as any)
                })
            }
        };

        socket.on("new-message", handleNewMessage);

        return () => {
            socket.off("new-message", handleNewMessage);
        };
    }, [conversationId]);
    useEffect(() => {
        const accessToken = getAccessTokenFromLS();
        if (accessToken) {
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

                        socket.on("groupCreated", ({ group, message }) => {
                            const formatted = {
                                _id: group._id,
                                type: "group",
                                name: group.name,
                                avatar: group.avatar,
                                participants: group.participants.map((p: any) => ({
                                    _id: p._id,
                                    fullName: p.fullName,
                                    avatar: p.avatar,
                                    phoneNumber: p.phoneNumber,
                                    label: p.fullName?.trim().split(" ").pop() || "Người lạ",
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
                                    fileMeta: [] as any[],
                                },
                                createdAt: group.createdAt,
                                updatedAt: group.updatedAt,
                            };

                            updateConversationList(formatted); // hoặc thêm vào state, ví dụ setConversationList([...prev, formatted])
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
