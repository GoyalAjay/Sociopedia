import React, { useEffect, useRef, useState } from "react";
import { IconButton, Box } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ImageCarousel = ({
    images = [],
    width = "100%",
    height = "460px",
    alt = "post image",
    fit = "contain",
    onImageClick,
}) => {
    // normalize images to array of urls
    const imgs = Array.isArray(images) ? images : images ? [images] : [];

    const [index, setIndex] = useState(0);
    const rootRef = useRef(null);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    useEffect(() => {
        // reset index when images change
        setIndex(0);
    }, [images]);

    // keyboard navigation
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const onKey = (e) => {
            if (e.key === "ArrowLeft") {
                e.stopPropagation();
                e.preventDefault();
                prev();
            } else if (e.key === "ArrowRight") {
                e.stopPropagation();
                e.preventDefault();
                next();
            }
        };
        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, [index, imgs.length]);

    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(imgs.length - 1, i + 1));

    // touch handlers for mobile swipe
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
        // stop propagation so parent doesn't treat swipe end as click
        if (e) {
            e.stopPropagation();
        }
        if (touchStartX.current === null || touchEndX.current === null) return;
        const dx = touchStartX.current - touchEndX.current;
        const threshold = 40; // px
        if (dx > threshold) next();
        else if (dx < -threshold) prev();
        touchStartX.current = null;
        touchEndX.current = null;
    };

    if (!imgs.length) return null;

    const normalizedHeight =
        typeof height === "number" ? `${height}px` : height;
    return (
        <Box
            ref={rootRef}
            tabIndex={0} // to receive keyboard events
            sx={{
                position: "relative",
                width,
                height: normalizedHeight,
                borderRadius: "0.75rem",
                overflow: "hidden",
                userSelect: "none",
                // backgroundColor: "#000",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={(e) => {}}
        >
            {/* Image */}
            <div className="w-full h-[450px] bg-black flex items-center justify-center overflow-hidden rounded-lg">
                <img
                    className="max-w-full max-h-full object-contain"
                    src={imgs[index]}
                    alt={`${alt} ${index + 1}`}
                    style={{
                        width: "100%",
                        height: height === "auto" ? "auto" : height,
                        objectFit: fit,
                        display: "block",
                    }}
                    crossOrigin="anonymous"
                    onClick={(e) => {
                        // stop propagation so parent doesn't pick up other accidental clicks
                        if (e && e.stopPropagation) e.stopPropagation();
                        if (onImageClick) onImageClick(index);
                    }}
                />
            </div>

            {/* Left arrow */}
            {index > 0 && (
                <IconButton
                    onClick={prev}
                    aria-label="Previous image"
                    sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.45)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                    }}
                >
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
            )}

            {/* Right arrow */}
            {index < imgs.length - 1 && (
                <IconButton
                    onClick={next}
                    aria-label="Next image"
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.45)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                    }}
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            )}

            {/* Dots */}
            {imgs.length > 1 && (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                    }}
                >
                    {imgs.map((_, i) => (
                        <Box
                            key={i}
                            onClick={() => setIndex(i)}
                            sx={{
                                width: i === index ? 10 : 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor:
                                    i === index
                                        ? "rgba(255,255,255,0.95)"
                                        : "rgba(255,255,255,0.45)",
                                cursor: "pointer",
                                transition: "width 120ms ease",
                            }}
                            aria-label={`Go to image ${i + 1}`}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ImageCarousel;
