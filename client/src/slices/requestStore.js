import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { useStore } from "zustand/react";

const requestStore = createStore(
    persist(
        (set) => ({
            accepted: {},
            outgoing: {},
            incoming: {},
            addAccepted: (id, data) =>
                set((state) => {
                    if(state.accepted[id]) return state;
                    return {
                        accepted: {
                            ...state.accepted,
                            [id]: data,
                        }
                    }
                }),

            setAccepted: (map) =>
                set(() => ({ accepted: map })),

            setOutgoing: (id, data) =>
                set((state) => {
                    if(state.outgoing[id]) return state;
                    return {
                        outgoing: {
                            ...state.outgoing,
                            [id]: data,
                        }
                    }
                }),

            setIncoming: (id, data) =>
                set((state) => {
                    if(state.incoming[id]) return state;
                    return {
                        incoming: {
                            ...state.incoming,
                            [id]: data,
                        }
                    }
                }),
            removeAccepted: (id) =>
                set((state) => {
                    const { [id]: _, ...rest } = state.accepted;
                    return { accepted: rest };
                }),

            removeIncoming: (id) =>
                set((state) => {
                    const { [id]: _, ...rest } = state.incoming;
                    return { incoming: rest };
                }),

            removeOutgoing: (id) =>
                set((state) => {
                    const { [id]: _, ...rest } = state.outgoing;
                    return { outgoing: rest };
                }),
            clear: () => set({accepted: {}, outgoing: {}, incoming: {}})
        }),
        { name: "requests" }
    )
);

export const useRequestStore = (selector) =>
    useStore(requestStore, selector);