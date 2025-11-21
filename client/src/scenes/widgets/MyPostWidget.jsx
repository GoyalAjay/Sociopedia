import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
    Stack,
} from "@mui/material";

import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../slices/authStore";
import { useCreatePostMutation } from "../../slices/postApi";

const MAX_IMAGES = 10;

const MyPostWidget = ({ picturePath }) => {
    const [isImage, setIsImage] = useState(false);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const user = useAuthStore((state) => state.user);
    const { _id } = user;
    const [createPost, { isLoading, error }] = useCreatePostMutation();
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    // create previews when images state changes
    useEffect(() => {
        // Revoke previous URLs
        previews.forEach((p) => URL.revokeObjectURL(p.url));

        const nextPreviews = images.map((file, idx) => ({
            id: `${file.name}-${file.size}-${idx}`,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
        }));
        setPreviews(nextPreviews);

        // cleanup on unmount
        return () => {
            nextPreviews.forEach((p) => URL.revokeObjectURL(p.url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);

    const handleDrop = (acceptedFiles) => {
        if (!acceptedFiles || acceptedFiles.length === 0) return;

        // keep total under MAX_IMAGES
        const spaceLeft = MAX_IMAGES - images.length;
        const toTake = acceptedFiles.slice(0, spaceLeft);

        // Filter acceptedFiles by type/size if needed
        setImages((prev) => [...prev, ...toTake]);
    };

    const removeImageAt = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        if (!post.trim() && images.length === 0) return;

        const formData = new FormData();
        formData.append("description", post.trim());

        // Append multiple files under same field name "pictures"
        images.forEach((file) => {
            formData.append("pictures", file);
        });

        await createPost(formData);
        setImages([]);
        setPost("");
        setIsImage(false);
        // window.location.reload(true);
    };

    const canDropMore = images.length < MAX_IMAGES;
    const remainingSlots = MAX_IMAGES - images.length;
    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(event) => setPost(event.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>
            {isImage && (
                <Box
                    borderRadius="5px"
                    border={`1px solid ${medium}`}
                    mt="1rem"
                    p="rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        onDrop={handleDrop}
                        multiple
                        maxFiles={MAX_IMAGES}
                        disabled={!canDropMore}
                    >
                        {({ getRootProps, getInputProps, isDragActive }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{
                                        "&:hover": {
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {!images.length ? (
                                        <Typography>
                                            {isDragActive
                                                ? "Drop images here..."
                                                : "Add images (up to 10)"}
                                        </Typography>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>
                                                {images.length} image(s)
                                                selected — {remainingSlots}{" "}
                                                slot(s) left
                                            </Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {/* Remove last button */}
                                {images.length > 0 && (
                                    <IconButton
                                        onClick={() => setImages([])}
                                        sx={{ width: "15%" }}
                                        title="Remove all"
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                    {/* Previews */}
                    {previews.length > 0 && (
                        <Box
                            mt="1rem"
                            display="flex"
                            gap="0.5rem"
                            flexWrap="wrap"
                        >
                            {previews.map((p, idx) => (
                                <Box
                                    key={p.id}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        position: "relative",
                                        border: `1px solid ${medium}`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <img
                                        src={p.url}
                                        alt={p.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => removeImageAt(idx)}
                                        sx={{
                                            position: "absolute",
                                            top: 2,
                                            right: 2,
                                            background: "rgba(255,255,255,0.8)",
                                            "&:hover": {
                                                background:
                                                    "rgba(255,255,255,1)",
                                            },
                                        }}
                                        aria-label={`Remove ${p.name}`}
                                    >
                                        <DeleteOutlined fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
            <Divider sx={{ margin: "1.25rem 0rem" }} />
            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Images
                    </Typography>
                </FlexBetween>
                {isNonMobileScreens ? (
                    <>
                        <FlexBetween gap="0.25rem">
                            <GifBoxOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Clip</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <AttachFileOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>
                                Attachment
                            </Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween>
                    </>
                ) : (
                    <FlexBetween gap="0.25rem">
                        <IconButton
                            onClick={() =>
                                setIsMobileMenuToggled(!isMobileMenuToggled)
                            }
                        >
                            <MoreHorizOutlined sx={{ color: mediumMain }} />
                        </IconButton>
                    </FlexBetween>
                )}
                <Button
                    disabled={!post}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        border: `1px solid ${palette.primary.main}`,
                        borderRadius: "3rem",
                        "&:hover": {
                            color: palette.primary.main,
                            border: `1px solid ${palette.primary.main}`,
                        },
                    }}
                >
                    POST
                </Button>
            </FlexBetween>
            {!isNonMobileScreens && isMobileMenuToggled && (
                <Stack
                    mt="1rem"
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={2}
                    gap="0.25rem"
                >
                    <FlexBetween
                        gap="0.25rem"
                        sx={{ justifyContent: "flex-start" }}
                    >
                        <GifBoxOutlined sx={{ color: mediumMain }} />
                        <Typography color={mediumMain}>Clip</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.25rem">
                        <AttachFileOutlined sx={{ color: mediumMain }} />
                        <Typography color={mediumMain}>Attachment</Typography>
                    </FlexBetween>

                    <FlexBetween
                        gap="0.25rem"
                        sx={{ justifyContent: "flex-end" }}
                    >
                        <MicOutlined sx={{ color: mediumMain }} />
                        <Typography color={mediumMain}>Audio</Typography>
                    </FlexBetween>
                </Stack>
            )}
        </WidgetWrapper>
    );
};

export default MyPostWidget;
