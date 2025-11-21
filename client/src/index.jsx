import { StrictMode } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./slices/reduxStore";
import router from "./router";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    // </StrictMode>
);
