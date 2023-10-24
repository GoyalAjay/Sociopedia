import { InputBase, Button, useTheme } from "@mui/material";
import UserImage from "./UserImage";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useState } from "react";

const InputComment = ({ postId, loggedInUserId, userPicturePath }) => {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);

    const handleCommentPost = async () => {
        const response = await fetch(
            `https://sociopedia-backend-9jo5.onrender.com/comments/${postId}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId: postId,
                    userId: loggedInUserId,
                    description: comment,
                }),
            }
        );
        const post = await response.json();
        dispatch(setPost({ post }));
        setComment("");
        window.location.reload(true);
    };

    return (
        <>
            <UserImage image={userPicturePath} />
            <InputBase
                placeholder="Write a comment..."
                onChange={(event) => setComment(event.target.value)}
                value={comment}
                sx={{
                    width: "100%",
                    backgroundColor: palette.neutral.light,
                    borderRadius: "2rem",
                    padding: "1rem 2rem",
                }}
            />

            <Button
                onClick={handleCommentPost}
                sx={{
                    width: "100px",
                    height: "50px",
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                    "&:hover": {
                        cursor: "pointer",
                        color: palette.primary.main,
                        border: `1px solid ${palette.primary.main}`,
                    },
                }}
            >
                Comment
            </Button>
        </>
    );
};

export default InputComment;
