import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { useStore } from "zustand/react";

const authStore = createStore(
    persist(
        (set) => ({
            user: null,
            setAuth: ({ user }) => set({ user }),
            logout: () => set({ user: null }),
        }),
        { name: "auth" }
    )
);

export const useAuthStore = (selector) =>
    useStore(authStore, selector);