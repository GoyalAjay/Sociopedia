import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    post: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("User friends non-existent!!");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts.reverse();
        },
        setPost: (state, action) => {
            const updatedPost = state.posts.map((post) => {
                if (post._id === action.payload.post._id) {
                    return action.payload.post;
                }
                return post;
            });
            state.posts = updatedPost;
        },
        setSinglePost: (state, action) => {
            if ("post" in action.payload) {
                state.posts.map((post) => {
                    if (post._id === action.payload.post._id) {
                        state.post = action.payload.post;
                    }
                });
            } else {
                state.post = [];
            }
        },
    },
});

export const {
    setMode,
    setLogin,
    setLogout,
    setFriends,
    setPosts,
    setPost,
    setSinglePost,
} = authSlice.actions;
export default authSlice.reducer;
