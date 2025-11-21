import { useState } from "react";
import {
    Badge,
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Tooltip,
} from "@mui/material";
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    People,
    Help,
    Menu,
    Close,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { useAuthStore } from "../../slices/authStore";
import { useThemeStore } from "../../slices/themeStore";
import { useRequestStore } from "../../slices/requestStore";
import { getSocket } from "../../socket/socket";
import useFriendRequests from "../../hooks/useFriendRequests";
import FriendRequestPopover from "../../components/FriendRequestPopover";

export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const {requests, handleAccept, handleRemove} = useFriendRequests();

    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const navigate = useNavigate();
    const user = useAuthStore((state)=> state.user);
    const logout = useAuthStore((state)=> state.logout);
    const clear = useRequestStore((state)=> state.clear);
    const mode = useThemeStore((state)=> state.mode);
    const toggleMode = useThemeStore((state)=> state.toggleMode);

    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "friend-requests-popover" : undefined;

    const handleLogout = () => {
        logout();
        clear();
    };

    const fullName = `${user.firstName} ${user.lastName}`;
    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
            <FlexBetween gap="1.75rem">
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate("/home")}
                    sx={{
                        "&:hover": {
                            color: primaryLight,
                            cursor: "pointer",
                        },
                    }}
                >
                    Sociopedia
                </Typography>
                {isNonMobileScreen && (
                    <FlexBetween
                        backgroundColor={neutralLight}
                        borderRadius="9px"
                        gap="3rem"
                        padding="0.1rem 1.5rem"
                    >
                        <InputBase placeholder="Search..." />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween>
                )}
            </FlexBetween>

            {/* DESKTOP NAV */}
            {isNonMobileScreen ? (
                <FlexBetween gap="2rem">
                    <Tooltip
                        disableInteractive
                        title={
                            theme.palette.mode === "dark"
                                ? "Click for light mode"
                                : "Click for dark mode"
                        }
                    >
                        <IconButton onClick={toggleMode}>
                            {mode === "dark" ? (
                                <DarkMode
                                    sx={{
                                        fontSize: "25px",
                                    }}
                                />
                            ) : (
                                <LightMode
                                    sx={{
                                        color: dark,
                                        fontSize: "25px",
                                    }}
                                />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Tooltip disableInteractive title="Friend Requests">
                        <IconButton color="inherit" onClick={handleClick}>
                            <Badge badgeContent={requests.length} color="error">
                                <People
                                    sx={{
                                        fontSize: "25px",
                                    }}
                                />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <FriendRequestPopover open={open} anchorEl={anchorEl} onClose={handleClose} requests={requests} onAccept={handleAccept} onReject={handleRemove}/>
                    <Message
                        sx={{
                            fontSize: "25px",
                        }}
                    />
                    <Notifications
                        sx={{
                            fontSize: "25px",
                        }}
                    />
                    <Help
                        sx={{
                            fontSize: "25px",
                        }}
                    />
                    <FormControl variant="standard" value={fullName}>
                        <Select
                            value={fullName}
                            sx={{
                                backgroundColor: neutralLight,
                                width: "150px",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                    pr: "0.25rem",
                                    width: "3rem",
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: neutralLight,
                                },
                            }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                        </Select>
                    </FormControl>
                </FlexBetween>
            ) : (
                <IconButton
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Menu />
                </IconButton>
            )}

            {/* MOBILE NAV */}
            {!isNonMobileScreen && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    backgroundColor={background}
                >
                    {/* CLOSE ICON */}
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton
                            title="icon-button"
                            onClick={() =>
                                setIsMobileMenuToggled(!isMobileMenuToggled)
                            }
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* MENU ITEMS */}
                    <FlexBetween
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap="3rem"
                    >
                        <IconButton
                            onClick={toggleMode}
                            sx={{ fontSize: "25px" }}
                        >
                            {theme.palette.mode === "dark" ? (
                                <DarkMode sx={{ fontSize: "25px" }} />
                            ) : (
                                <LightMode
                                    sx={{ color: dark, fontSize: "25px" }}
                                />
                            )}
                        </IconButton>
                        <Message sx={{ fontSize: "25px" }} />
                        <Notifications sx={{ fontSize: "25px" }} />
                        <Help sx={{ fontSize: "25px" }} />
                        <FormControl variant="standard" value={fullName}>
                            <Select
                                value={fullName}
                                sx={{
                                    backgroundColor: neutralLight,
                                    width: "150px",
                                    borderRadius: "0.25rem",
                                    padding: "0.25rem 1rem",
                                    "& .MuiSvgIcon-root": {
                                        pr: "0.25rem",
                                        width: "3rem",
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: neutralLight,
                                    },
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Log Out
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </FlexBetween>
                </Box>
            )}
        </FlexBetween>
    );
}
