import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useAuthStore } from "../../slices/authStore";
import { useRequestStore } from "../../slices/requestStore";
import { useGetFriendsQuery } from "../../slices/userApi";


const FriendListWidget = ({ userId }) => {
    const { palette } = useTheme();
    const user = useAuthStore((state) => state.user);
    const accepted = useRequestStore((state) => state.accepted)
    console.log("accepted: ", accepted)
    Object.entries(accepted).map(([id, friend]) => {
        console.log(id)
        console.log(friend)
    })
    // const { data: friends, isLoading, error } = useGetFriendsQuery(user._id);

    return (
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {Object.entries(accepted).map(([id, friend]) => {
                    <Friend
                        key={id}
                        friendId={id}
                        name= {friend.name}
                        userPicturePath={friend.profilePic}
                    />
                })}
            </Box>
        </WidgetWrapper>
    );
};

export default FriendListWidget;
