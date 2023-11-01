import { Divider, Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import FlexBetween from "./FlexBetween";
import GetComment from "./GetComments";
import InputComment from "components/InputComment";
import Friend from "./Friend";

const GetPost = () => {
    const post = useSelector((state) => state.post);
    var isEmpty = true;

    const user = useSelector((state) => state.user);
    if ("_id" in post) {
        isEmpty = false;
    }
    const { palette } = useTheme();
    const loggedInUserId = useSelector((state) => state.user._id);
    const main = palette.neutral.main;

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
                        <Box sx={{ width: "40%", backgroundColor: "white" }}>
                            <Box sx={{ margin: "2rem 1rem 0 1rem " }}>
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
                                <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="stretch"
                                    spacing={2}
                                    gap="0.25rem"
                                >
                                    <Divider />
                                    {post.comments.map(
                                        ({
                                            _id,
                                            firstName,
                                            lastName,
                                            description,
                                            userPicturePath,
                                        }) => (
                                            <GetComment
                                                key={_id}
                                                commentId={_id}
                                                name={`${firstName} ${lastName}`}
                                                description={description}
                                                userPicturePath={
                                                    userPicturePath
                                                }
                                            />
                                        )
                                    )}
                                    <FlexBetween gap="0.25rem" mt="1rem">
                                        <InputComment
                                            postId={post._id}
                                            loggedInUserId={user._id}
                                            userPicturePath={
                                                user.userPicturePath
                                            }
                                        />
                                    </FlexBetween>
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                </FlexBetween>
            ) : undefined}
        </>
    );
};

export default GetPost;
