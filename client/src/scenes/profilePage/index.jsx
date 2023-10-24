import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import ProfileForm from "./ProflieForm";

export default function ProfilePage() {
    const theme = useTheme();
    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

    return (
        <Box>
            <Box
                width={isNonMobileScreen ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <ProfileForm />
            </Box>
        </Box>
    );
}
