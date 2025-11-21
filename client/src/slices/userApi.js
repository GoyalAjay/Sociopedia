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
        sendRequest: builder.mutation({
            query: (data) => ({
                url: 'user/requests',
                method: 'POST',
                body: data
            })
        }),

        updateRequest: builder.mutation({
            query: ({id, data}) => ({
                url:`user/requests/${id}`,
                method: 'PATCH',
                body: data
            })
        }),

        // Queries
        getFriends: builder.query({
            query: (id) => ({
                url: `user/friends/${id}`,
                method: "GET",
            }),
        }),

        getRequestList: builder.query({
            query: () => ({
                url: `user/requests/list`,
                method: 'GET'
            })
        }),

        getRequests: builder.query({
            query: () => ({
                url: `user/requests`,
                method: 'GET'
            })
        })
    }),
});

export const { useLoginMutation, useRegisterMutation, useSendRequestMutation, useUpdateRequestMutation, useGetFriendsQuery, useGetRequestsQuery, useGetRequestListQuery } =
    userApi;
