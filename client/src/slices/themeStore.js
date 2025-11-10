import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
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
