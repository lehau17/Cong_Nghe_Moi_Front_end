import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserProfile } from './apis/user.api';
import './App.css';
import { SocketContext } from './context/SocketContext';
import { getAccessTokenFromLS } from './lib/auth';
import AppRouter from './router';
function App() {
    const socket = useContext(SocketContext);
    const { refetch } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        enabled: false, // 👈 để không fetch ngay từ đầu
    });
    useEffect(() => {
        const accessToken = getAccessTokenFromLS();
        console.log("check accessToken", accessToken)
        if (accessToken) {
            refetch()
                .then((result) => {
                    console.log("check data", result)
                    if (result.isSuccess && result.data) {
                        // 👇 Gắn token + connect + emit
                        socket.auth = { token: accessToken };
                        socket.connect();
                        socket.on("connect", () => {
                            console.log("✅ Socket connected & registered");
                            socket.emit("register", result.data.data.data._id);
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
            console.error("❌ Connect error:", err.message); // <- CỰC QUAN TRỌNG
        });


        return () => {
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
