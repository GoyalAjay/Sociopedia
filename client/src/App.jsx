import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import { useThemeStore } from "./slices/themeStore";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
    const mode = useThemeStore((state) => state.mode);
    // const { mode } = useThemeStore();
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Outlet />
            </ThemeProvider>
        </div>
    );
}

export default App;
