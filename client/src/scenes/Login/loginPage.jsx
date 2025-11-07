import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { useLoginMutation } from "../../slices/userApi";
import { loginSchema } from "../../validations/validations";
import { useAuthStore } from "../../slices/authStore";

export default function LoginPage() {
    const theme = useTheme();
    const { palette } = useTheme();

    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const [login, { isLoading, error }] = useLoginMutation();
    const setAuth = useAuthStore((s) => s.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const validData = await loginSchema.validate(
                { email, password },
                { abortEarly: false }
            );

            const res = await login(validData).unwrap();
            console.log(res);
            const { userObj } = res;
            setAuth({ user: userObj });
            navigate("/home");
        } catch (error) {
            const newErrors = {};
            error.inner.forEach((e) => (newErrors[e.path] = e.message));
            setErrors(newErrors);
        }
    };
    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography fontWeight="bold" fontSize="32px" color="primary">
                    Sociopedia
                </Typography>
            </Box>
            <Box
                width={isNonMobileScreen ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Welcome to Sociopedia, the social media for Sociopaths!
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box display="grid" gap="20px">
                        <TextField
                            label="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "1rem 0",
                                p: "0.8rem",
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.background.alt,
                            }}
                        >
                            LOGIN
                        </Button>

                        <FlexBetween>
                            <Typography
                                onClick={() => navigate("/register")}
                                sx={{
                                    textDecoration: "underline",
                                    color: theme.palette.primary.main,
                                    cursor: "pointer",
                                }}
                            >
                                Don’t have an account? Sign up here.
                            </Typography>
                            <Typography
                                onClick={() => navigate("/forgot-password")}
                                sx={{
                                    textDecoration: "underline",
                                    color: theme.palette.primary.main,
                                    cursor: "pointer",
                                }}
                            >
                                Forget Password?
                            </Typography>
                        </FlexBetween>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
