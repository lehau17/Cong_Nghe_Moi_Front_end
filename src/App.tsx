import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import AppRouter from './router';
const queryClient = new QueryClient()
function App() {

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
        <QueryClientProvider client={queryClient}>
            <AppRouter />
        </QueryClientProvider>
    </>
  )
}

export default App
