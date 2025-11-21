import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { useStore } from "zustand/react";

const themeStore = createStore(
    persist(
        (set, get) => ({
            mode: "light",
            toggleMode: () =>
                set({ mode: get().mode === "light" ? "dark" : "light" }),
            setMode: (newMode) => set({ mode: newMode }),
        }),
        { name: "theme" }
    )
);

export const useThemeStore = (selector) =>
    useStore(themeStore, selector);