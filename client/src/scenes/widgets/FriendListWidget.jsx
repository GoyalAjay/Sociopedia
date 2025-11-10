import { Box, Typography, useTheme } from "@mui/material";
// import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useAuthStore } from "../../slices/authStore";
import { useGetFriendsQuery } from "../../slices/userApi";

const FriendListWidget = ({ userId }) => {
    const { palette } = useTheme();
    const { user } = useAuthStore();
    const { data: friends, isLoading, error } = useGetFriendsQuery(user._id);

    console.log(data, friends);
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
                {friends.map((friend) => ({
                    /* <Friend
                        key={friend._id}
                        friendId={friend._id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        subtitle={friend.occupation}
                        userPicturePath={friend.picturePath}
                    /> */
                }))}
            </Box>
        </WidgetWrapper>
    );
};

export default FriendListWidget;
