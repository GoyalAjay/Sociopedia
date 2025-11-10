import { apiSlice } from "./baseApi";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Mutations
        login: builder.mutation({
            query: (data) => ({
                url: `auth/login`,
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: "auth/register",
                method: "POST",
                body: data,
            }),
        }),

        // Queries
        getFriends: builder.query({
            query: (id) => ({
                url: `/friends/${id}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetFriendsQuery } =
    userApi;
