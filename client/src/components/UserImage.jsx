import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
    return (
        <Box width={size} height={size}>
            <img
                crossOrigin="anonymous"
                style={{ objectFit: "cover", borderRadius: "50%" }}
                width={size}
                height={size}
                alt="user"
                src={`https://sociopedia-backend-9jo5.onrender.com/assets/${image}`}
            />
        </Box>
    );
};

export default UserImage;
