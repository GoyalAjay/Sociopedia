import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./scenes/login/loginPage";
import RegisterPage from "./scenes/register/registerPage";
import HomePage from "./scenes/home";
import App from "./App";
import ProtectedRoute from "./components/protectedRoute";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            { path: "/", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            // { path: '/resetPassword/:randomId', element: },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/home", element: <HomePage /> },
                    // { path: '/post/:postId', element: },
                    // { path: '/profile/:userId', element: },
                    // { path: '/user/:userId', element: },
                ],
            },
        ],
    },
]);

export default router;
