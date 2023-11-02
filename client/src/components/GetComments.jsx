import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const GetComment = ({
    commentId,
    commentUserId,
    name,
    description,
    userPicturePath,
}) => {
    const navigate = useNavigate();

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primaryDark = palette.primary.dark;
    const light = palette.neutral.light;
    return (
        <FlexBetween
            key={commentId}
            sx={{
                justifyContent: "flex-start",
            }}
        >
            <UserImage image={userPicturePath} size="40px" />
            <Box
                m="0.75rem 0rem 0.5rem 1rem"
                p="0.4rem 1rem"
                sx={{
                    backgroundColor: light,
                    borderRadius: "0.5rem",
                }}
            >
                <Box
                    onClick={() => {
                        navigate(`/user/${commentUserId}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        lineHeight="1.2308"
                        fontSize="1rem"
                        fontWeight="600"
                        sx={{
                            "&:hover": {
                                color: primaryDark,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                </Box>
                <Typography
                    lineHeight="1.333"
                    fontSize="0.92rem"
                    fontWeight="400"
                >
                    {description}
                </Typography>
            </Box>
        </FlexBetween>
    );
};

export default GetComment;
