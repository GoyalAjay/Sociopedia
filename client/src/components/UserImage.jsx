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
                    src={`${image}`}
                />
            ) : (
                <img
                    crossOrigin="anonymous"
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    width={size}
                    height={size}
                    alt="user"
                    src="https://sociopediaimages.s3.ap-south-1.amazonaws.com/uploads/default.png"
                />
            )}
        </Box>
    );
};

export default UserImage;
