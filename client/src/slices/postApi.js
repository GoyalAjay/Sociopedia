import { apiSlice } from "./baseApi";

export const postApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: () => ({
                url: "posts/",
                method: "GET",
            }),
        }),
        getUserPosts: builder.query({
            query: (userId) => ({
                url: `posts/${userId}`,
                method: "GET",
            }),
        }),

        createPost: builder.mutation({
            query: (data) => ({
                url: "posts/",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useGetPostsQuery, useGetUserPostsQuery, useCreatePostMutation } =
    postApi;
