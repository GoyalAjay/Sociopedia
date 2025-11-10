import { useEffect, useState } from "react";
import PostWidget from "./PostWidget";
import { getSocket } from "../../socket/socket";
import { useGetPostsQuery, useGetUserPostsQuery } from "../../slices/postApi";

const PostsWidget = ({ userId, isProfile = false }) => {
    let {
        data: initialPosts = [],
        isLoading,
        error,
    } = isProfile ? useGetUserPostsQuery(userId) : useGetPostsQuery();

    const [posts, setPosts] = useState(initialPosts);

    // Sync when query updates (initial fetch / refetch)
    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    const socket = getSocket();
    const handlePosts = (data) => {
        // If server sends an entire array:
        if (Array.isArray(data.posts)) {
            setPosts(data.posts);
            return;
        }
    };
    socket.on("posts", handlePosts);

    if (isLoading) return <div>Loading posts...</div>;
    if (error) return <div>Error fetching posts</div>;

    return (
        <>
            {posts.map(
                ({
                    _id,
                    userId,
                    userName,
                    description,
                    location,
                    picturePath,
                    userPicturePath,
                    likes,
                    comments,
                }) => (
                    <PostWidget
                        key={_id}
                        postId={_id}
                        postUserId={userId}
                        name={`${userName}`}
                        description={description}
                        location={location}
                        picturePath={picturePath}
                        userPicturePath={userPicturePath}
                        likes={likes}
                        comments={comments}
                    />
                )
            )}
        </>
    );
};

export default PostsWidget;
