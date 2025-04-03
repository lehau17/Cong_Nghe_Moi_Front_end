import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ChatWindow from "./components/shared/ChatWindow";
import FriendListPage from "./page/FriendListPage";
import LoginPage from "./page/LoginPage";
import SettingRolePrivatePage from "./page/SettingRolePrivate";
import SettingUtilPage from "./page/SettingUtilPage";
import ChatTemplate from "./template/Chat";
import FriendListTemplate from "./template/Friend";
import SettingTemplate from "./template/Setting";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ChatTemplate>
              <ChatWindow />
            </ChatTemplate>
          }
        />
        <Route
          path="/chat"
          element={
            <ChatTemplate>
              <ChatWindow />
            </ChatTemplate>
          }
        />
        <Route
          path="/friend-list"
          element={
            <FriendListTemplate>
              <FriendListPage />
            </FriendListTemplate>
          }
        />

        {/* Setting route */}
        <Route path="/setting" element={<SettingTemplate />}>
              <Route index element={<Navigate to="private-permission" replace />} />
            <Route path="private-permission" element={<SettingRolePrivatePage />} />
            <Route path="notification" element={<div>Notification Setting</div>} />
            <Route path="profile" element={<div>Profile Setting</div>} />
            <Route path="util" element={<SettingUtilPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
