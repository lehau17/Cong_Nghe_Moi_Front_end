import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ChatWindow from "./components/shared/ChatWindow";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PublicRoute from "./components/shared/PublicRoute";
import ForgotPasswordPage from "./page/ForgotPasswordPage";
import FriendListPage from "./page/FriendListPage";
import GeneralPageSetting from "./page/GeneralPageSetting";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import SettingFastMessagePage from "./page/SettingFastMessagePage";
import SettingRolePrivatePage from "./page/SettingRolePrivate";
import SettingUtilPage from "./page/SettingUtilPage";
import VerifyOTPPage from "./page/VerifyOTPPage";
import ChatTemplate from "./template/Chat";
import FriendListTemplate from "./template/Friend";
import SettingTemplate from "./template/Setting";


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <ChatTemplate>
                                <ChatWindow />
                            </ChatTemplate>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/verify-otp"
                    element={
                        <VerifyOTPPage />
                    }
                />


                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatTemplate>
                                <ChatWindow />
                            </ChatTemplate>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/friend-list"
                    element={
                        <ProtectedRoute>
                            <FriendListTemplate>
                                <FriendListPage />
                            </FriendListTemplate>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <PublicRoute>
                            <ForgotPasswordPage />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/setting"
                    element={
                        <ProtectedRoute>
                            <SettingTemplate />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="private-permission" replace />} />
                    <Route path="private-permission" element={<SettingRolePrivatePage />} />
                    <Route path="general" element={<GeneralPageSetting />} />
                    <Route path="message" element={<SettingFastMessagePage />} />
                    <Route path="util" element={<SettingUtilPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
