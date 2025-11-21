import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../slices/authStore";

const ProtectedRoute = () => {
    const user = useAuthStore((state) => state.user);
    // const { user } = useAuthStore();
    if (!user) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default ProtectedRoute;
