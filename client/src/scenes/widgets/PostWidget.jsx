import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";

import { Divider, IconButton, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

import InputComment from "components/InputComment";
import GetComment from "components/GetComments";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
}) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const patchLike = async () => {
        const response = await fetch(
            `https://sociopedia-backend-9jo5.onrender.com/posts/${postId}/like`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUserId }),
            }
        );
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    };

    const getPost = async () => {
        const response = await fetch(
            `https://sociopedia-backend-9jo5.onrender.com/posts/${postId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        dispatch(setPost({ post: data }));
    };

    return (
        <WidgetWrapper m="2rem 0">
            <Friend
                loggedInUserId={loggedInUserId}
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{ mt: "1rem", fontSize: "1.75rem" }}>
                {description}
            </Typography>
            <FlexBetween sx={{ height: "100%", width: "100%" }}>
                {picturePath && (
                    <img
                        width="100%"
                        height="auto"
                        alt="post"
                        style={{
                            borderRadius: "0.75rem",
                            marginTop: "0.75rem",
                        }}
                        crossOrigin="anonymous"
                        src={`/assets/${picturePath}`}
                    />
                )}
            </FlexBetween>
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>
                    {/* COMMENTS */}
                    <FlexBetween gap="0.3rem">
                        <IconButton
                            onClick={() => {
                                comments.length <= 2
                                    ? setIsComments(!isComments)
                                    : handleOpen();
                            }}
                        >
                            <ChatBubbleOutlineOutlined />
                            <Typography ml="0.2rem">Comment</Typography>
                        </IconButton>
                    </FlexBetween>
                </FlexBetween>
                <IconButton>
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>
            {isComments ? (
                comments.length > 0 ? (
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={2}
                        gap="0.25rem"
                    >
                        <Divider />
                        {comments.map(
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
                                    userPicturePath={userPicturePath}
                                />
                            )
                        )}
                        <FlexBetween gap="0.25rem" mt="1rem">
                            <InputComment
                                postId={postId}
                                loggedInUserId={loggedInUserId}
                                userPicturePath={userPicturePath}
                            />
                        </FlexBetween>
                    </Stack>
                ) : (
                    <FlexBetween gap="0.25rem" mt="1rem">
                        <InputComment
                            postId={postId}
                            loggedInUserId={loggedInUserId}
                            userPicturePath={userPicturePath}
                        />
                    </FlexBetween>
                )
            ) : undefined}
            {/* MODAL */}
            <FlexBetween>
                <BootstrapDialog
                    aria-labelledby="title"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="title">
                        <FlexBetween sx={{ justifyContent: "center" }}>
                            <Typography id="title" variant="h4" component="h2">
                                {name}'s Post
                            </Typography>
                        </FlexBetween>
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <Typography id="transition-modal-description">
                            <Friend
                                friendId={postUserId}
                                name={name}
                                subtitle={location}
                                userPicturePath={userPicturePath}
                            />
                            <Typography color={main} sx={{ mt: "1rem" }}>
                                {description}
                            </Typography>
                            {picturePath && (
                                <img
                                    width="100%"
                                    height="auto"
                                    alt="post"
                                    style={{
                                        borderRadius: "0.75rem",
                                        marginTop: "0.75rem",
                                    }}
                                    crossOrigin="anonymous"
                                    src={`https://sociopedia-backend-9jo5.onrender.com/assets/${picturePath}`}
                                />
                            )}
                            <FlexBetween mt="0.25rem">
                                <FlexBetween gap="1rem">
                                    <FlexBetween gap="0.3rem">
                                        <IconButton onClick={patchLike}>
                                            {isLiked ? (
                                                <FavoriteOutlined
                                                    sx={{
                                                        color: primary,
                                                    }}
                                                />
                                            ) : (
                                                <FavoriteBorderOutlined />
                                            )}
                                        </IconButton>
                                        <Typography>{likeCount}</Typography>
                                    </FlexBetween>
                                    <FlexBetween gap="0.3rem">
                                        <IconButton
                                            onClick={getPost}
                                        ></IconButton>
                                    </FlexBetween>
                                    {/* COMMENTS */}
                                    <FlexBetween gap="0.3rem">
                                        <IconButton>
                                            <ChatBubbleOutlineOutlined />
                                        </IconButton>
                                    </FlexBetween>
                                </FlexBetween>
                                <IconButton>
                                    <ShareOutlined />
                                </IconButton>
                            </FlexBetween>
                        </Typography>
                        <Stack
                            id="transition-modal-footer"
                            direction="column"
                            justifyContent="center"
                            alignItems="stretch"
                            spacing={2}
                            gap="0.25rem"
                        >
                            <Divider />
                            {comments.map(
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
                                        userPicturePath={userPicturePath}
                                    />
                                )
                            )}
                            <FlexBetween gap="0.25rem" mt="1rem">
                                <InputComment
                                    postId={postId}
                                    loggedInUserId={loggedInUserId}
                                    userPicturePath={userPicturePath}
                                />
                            </FlexBetween>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "flex-start" }}>
                        <FlexBetween gap="0.25rem" sx={{ width: "900px" }}>
                            <InputComment
                                postId={postId}
                                loggedInUserId={loggedInUserId}
                                userPicturePath={userPicturePath}
                            />
                        </FlexBetween>
                    </DialogActions>
                </BootstrapDialog>
            </FlexBetween>
        </WidgetWrapper>
    );
};

export default PostWidget;
