import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMyConversations } from './apis/conversation.api';
import { getUserProfile } from './apis/user.api';
import './App.css';
import { SocketContext } from './context/SocketContext';
import { getAccessTokenFromLS } from './lib/auth';
import AppRouter from './router';
function App() {
    const socket = useContext(SocketContext);
    const { refetch: refetchUserProfile } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        enabled: false, // 👈 để không fetch ngay từ đầu
    });
    const { refetch } = useQuery({
        queryKey: ["myConversations"],
        queryFn: getMyConversations,
    });
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
                            console.log("✅ Socket connected & registered");
                            socket.emit("register", result.data.data.data._id);
                        });
                        socket.on("friend-request", (data) => {
                            console.log("nhận lơuf mời kết bạn", data)
                            toast.info(`${data.from.fullName} đã gửi lời mời kết bạn!`);
                        });
                        socket.on("new-message", (message) => {
                            console.log("có tin nhắn mới>>>", message)
                            refetch();
                        });
                    } else {
                        console.warn("⚠️ Không lấy được thông tin user");
                    }
                })
                .catch((err) => {
                    console.error("❌ Lỗi khi lấy user profile:", err);
                    // 👉 TODO: nếu cần logout, clear token tại đây
                    localStorage.removeItem("access_token");
                    socket.disconnect(); // ngắt đề phòng
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
        </>
    )
}

export default App
