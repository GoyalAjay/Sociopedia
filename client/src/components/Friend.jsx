import React, { useEffect } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useAuthStore } from "../slices/authStore";
import { useRequestStore } from "../slices/requestStore";
import { useSendRequestMutation, useGetRequestListQuery } from "../slices/userApi";

const Friend = ({
    loggedInUserId,
    friendId,
    name,
    subtitle,
    userPicturePath,
}) => {
    const navigate = useNavigate();
    const user = useAuthStore((state)=> state.user);

    console.log("From friend list: ", friendId);
    console.log("From friend list: ", name);
    console.log("From friend list: ", userPicturePath);

    const accepted = useRequestStore((state)=> state.accepted);
    const outgoing = useRequestStore((state)=> state.outgoing);
    const incoming = useRequestStore((state)=> state.incoming);
    const setAccepted = useRequestStore((state)=> state.setAccepted);
    const setOutgoing = useRequestStore((state)=>state.setOutgoing)
    const setIncoming = useRequestStore((state)=>state.setIncoming)
    // const { setOutgoing, setIncoming } = useRequestStore();
    const { _id } = user;

    const [
            sendRequest,
            { data: requests, isSuccess: requestsSuccess, isLoading: requestsLoading },
        ] = useSendRequestMutation();


    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isFriend = !!accepted[friendId];
    const pending = !!outgoing[friendId] || !!incoming[friendId];

    const patchFriend = async () => {
        const data = {targetId: friendId}
        const response = await sendRequest(data);
        // if(response.data?.success){
        //     setOutgoing(friendId, {
        //             name: data.name,
        //             profilePic: data.picturePath
        //         })
        //     setOutgoing(prev => [...prev, friendId])
        // }
    };

    const handlePendingClick = () => {
        alert("Do you want to cancel the request?");
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
                isFriend ? (
                    <IconButton
                        onClick={patchFriend}
                        sx={{
                            backgroundColor: primaryLight,
                            p: "0.6rem",
                        }}
                    >
                        <PersonRemoveOutlined
                            sx={{
                                color: primaryDark,
                            }}
                        />
                    </IconButton>
                ) : pending ? (
                    <Button
                        variant="contained"
                        onClick={handlePendingClick}
                        sx={{
                            backgroundColor: "#d3d3d3",
                            color: "#555",
                            "&:hover": {
                                backgroundColor: "#c0c0c0",
                            },
                            fontWeight: 500,
                            textTransform: "none",
                        }}
                    >
                        Pending
                    </Button>
                ) : (
                    <IconButton
                        onClick={patchFriend}
                        sx={{
                            backgroundColor: primaryLight,
                            p: "0.6rem",
                        }}
                    >
                        <PersonAddOutlined
                            sx={{
                                color: primaryDark,
                            }}
                        />
                    </IconButton>
                )
            ) : null}
        </FlexBetween>
    );
};

export default Friend;
