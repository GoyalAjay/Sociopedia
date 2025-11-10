import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useAuthStore } from "../slices/authStore";

const Friend = ({
    loggedInUserId,
    friendId,
    name,
    subtitle,
    userPicturePath,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { _id, friends } = user;
    // const token = useSelector((state) => state.token);

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isFriend = friends.find((friend) => friend._id === friendId);

    const patchFriend = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/users/${_id}/${friendId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
        window.location.reload(true);
    };

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/user/${friendId}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: primaryDark,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            {loggedInUserId !== friendId ? (
                <IconButton
                    onClick={patchFriend}
                    sx={{
                        backgroundColor: primaryLight,
                        p: "0.6rem",
                    }}
                >
                    {isFriend ? (
                        <PersonRemoveOutlined
                            sx={{
                                color: primaryDark,
                            }}
                        />
                    ) : (
                        <PersonAddOutlined
                            sx={{
                                color: primaryDark,
                            }}
                        />
                    )}
                </IconButton>
            ) : undefined}
        </FlexBetween>
    );
};

export default Friend;
