import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatWindow from "./components/shared/ChatWindow";
import LoginPage from "./page/LoginPage";
import ChatTemplate from "./template/Chat";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
              <Route path="/auth" element={<LoginPage />} />
              <Route path="/chat" element={<ChatTemplate>
                  <ChatWindow />
              </ChatTemplate>} />

          </Routes>

    </BrowserRouter>
  );
};

export default AppRouter;
