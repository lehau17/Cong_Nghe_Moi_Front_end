import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatWindow from "./components/shared/ChatWindow";
import FriendListPage from "./page/FriendListPage";
import LoginPage from "./page/LoginPage";
import ChatTemplate from "./template/Chat";
import FriendListTemplate from "./template/Friend";
import SettingTemplate from "./template/Setting";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
              <Route path="/auth" element={<LoginPage />} />
              <Route path="/chat" element={<ChatTemplate>
                  <ChatWindow />
              </ChatTemplate>} />
              <Route path="/friend-list" element={<FriendListTemplate>
                  <FriendListPage />
              </FriendListTemplate>} />
              <Route path="/setting" element={<SettingTemplate>
              </SettingTemplate>} />

          </Routes>

    </BrowserRouter>
  );
};

export default AppRouter;
