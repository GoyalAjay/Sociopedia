import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userAuthStore = create(
    persist(
        (set) => ({
            user: null,
            setAuth: ({ user }) => set({ user }),
            clearAuth: () => set({ user: null }),
        }),
        { name: "auth" }
    )
);
