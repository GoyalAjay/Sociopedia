import { Divider, Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import FlexBetween from "./FlexBetween";
import GetComment from "./GetComments";
import InputComment from "components/InputComment";
import Friend from "./Friend";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { setSinglePost } from "state";
import "../index.css";

function useScrollTop() {
    const [scrollTop, setScrollTop] = useState(0);
    const onScroll = (event) => setScrollTop(event.target.scrollTop);
    return [scrollTop, { onScroll }];
}

const GetPost = () => {
    const [scrollTop, scrollProps] = useScrollTop();
    const post = useSelector((state) => state.post);
    var isEmpty = true;

    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();
    const { postId } = useParams();

    const user = useSelector((state) => state.user);
    if ("_id" in post) {
        isEmpty = false;
    }

    useEffect(() => {
        const getPost = async () => {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/posts/post/${postId}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await response.json();
            dispatch(setSinglePost({ post: data }));
        };
        getPost();
    }, [postId, token, dispatch]);

    const { palette } = useTheme();
    const loggedInUserId = useSelector((state) => state.user._id);
    const main = palette.neutral.main;
    const alt = palette.background.alt;

    return (
        <>
            {!isEmpty ? (
                <FlexBetween
                    sx={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="stretch"
                        gap="0.25rem"
                        width="100%"
                        height="100%"
                    >
                        <FlexBetween
                            sx={{
                                height: "100%",
                                width: "100%",
                                backgroundColor: `#1a1a1a`,
                            }}
                        >
                            {post.picturePath && (
                                <img
                                    alt="post"
                                    style={{
                                        borderRadius: "0.75rem",
                                        padding: "4rem",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                    crossOrigin="anonymous"
                                    src={`${post.picturePath}`}
                                />
                            )}
                        </FlexBetween>
                        <Box
                            sx={{
                                width: "40%",
                                backgroundColor: { alt },
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: "28%",
                                    overflow: "hidden",
                                    padding: "2rem 1rem 0 1rem",
                                }}
                            >
                                <Friend
                                    loggedInUserId={loggedInUserId}
                                    friendId={post.userId}
                                    name={`${post.firstName} ${post.lastName}`}
                                    subtitle={post.location}
                                    userPicturePath={post.userPicturePath}
                                />
                                <Typography
                                    color={main}
                                    sx={{ mt: "1rem", fontSize: "1.75rem" }}
                                >
                                    {post.description}
                                </Typography>
                                {scrollTop === 0 ? (
                                    <Divider sx={{ marginTop: "1rem" }} />
                                ) : undefined}
                            </Box>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="stretch"
                                spacing={2}
                                gap="0.25rem"
                            >
                                <Box
                                    {...scrollProps}
                                    sx={{
                                        boxShadow:
                                            scrollTop > 0
                                                ? "inset 0 8px 5px -5px rgb(0 0 0 / 0.4)"
                                                : "none",
                                        transition: "box-shadow 0.3s",
                                        position: "absolute",
                                        width: "28%",
                                        top: "160px",
                                        bottom: "100px",
                                        overflow: "auto",
                                    }}
                                >
                                    {post.comments.map(
                                        ({
                                            _id,
                                            userId,
                                            firstName,
                                            lastName,
                                            description,
                                            userPicturePath,
                                        }) => (
                                            <GetComment
                                                key={_id}
                                                commentId={_id}
                                                commentUserId={userId}
                                                name={`${firstName} ${lastName}`}
                                                description={description}
                                                userPicturePath={
                                                    userPicturePath
                                                }
                                            />
                                        )
                                    )}
                                </Box>
                            </Stack>
                            <FlexBetween
                                gap="0.25rem"
                                mt="1rem"
                                sx={{
                                    position: "absolute",
                                    bottom: "20px",
                                    // height: "200px",
                                    overflow: "hidden",
                                    width: "28%",
                                }}
                            >
                                <InputComment
                                    postId={post._id}
                                    loggedInUserId={user._id}
                                    userPicturePath={user.userPicturePath}
                                />
                            </FlexBetween>
                        </Box>
                    </Stack>
                </FlexBetween>
            ) : undefined}
        </>
    );
};

export default GetPost;
