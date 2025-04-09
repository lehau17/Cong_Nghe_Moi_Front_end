import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
        return <Navigate to="/chat" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
