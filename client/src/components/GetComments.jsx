import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const GetComment = ({ commentId, name, description, userPicturePath }) => {
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primaryDark = palette.primary.dark;
    return (
        <FlexBetween
            key={commentId}
            sx={{
                justifyContent: "flex-start",
            }}
        >
            <UserImage image={userPicturePath} size="40px" />
            <Box
                m="0rem 1rem"
                p="0.4rem 1rem"
                sx={{
                    backgroundColor: "#e4e6eb",
                    borderRadius: "0.5rem",
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
