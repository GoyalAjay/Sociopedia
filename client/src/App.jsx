import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "./scenes/loginPage/loginPage";
import ProfilePage from "scenes/profilePage";
import PasswordResetPage from "scenes/resetPassword";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import UserPage from "scenes/user";
import GetPost from "components/GetPost";

function App() {
    const mode = useSelector((state) => state.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    const isUser = useSelector((state) => state.token);

    return (
        <div className="app">
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route
                            path="/home"
                            element={
                                isAuth ? <HomePage /> : <Navigate to="/" />
                            }
                        />
                        <Route
                            path="/post/:postId"
                            element={isAuth ? <GetPost /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/profile/:userId"
                            element={
                                isAuth ? <ProfilePage /> : <Navigate to="/" />
                            }
                        />
                        <Route
                            path="/user/:userId"
                            element={
                                isAuth ? <UserPage /> : <Navigate to="/" />
                            }
                        />
                        <Route
                            exact
                            path="/resetPassword/:randomId"
                            element={<PasswordResetPage />}
                        />
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
