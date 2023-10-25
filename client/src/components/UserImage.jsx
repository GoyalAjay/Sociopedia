import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
    return (
        <Box width={size} height={size}>
            {image ? (
                <img
                    crossOrigin="anonymous"
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    width={size}
                    height={size}
                    alt="user"
                    src={`${process.env.REACT_APP_SERVER_URL}/assets/${image}`}
                />
            ) : (
                <img
                    crossOrigin="anonymous"
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    width={size}
                    height={size}
                    alt="user"
                    src={`${process.env.REACT_APP_SERVER_URL}/assets/default.png`}
                />
            )}
        </Box>
    );
};

export default UserImage;
