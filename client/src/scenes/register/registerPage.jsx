import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { registerSchema } from "../../validations/validations";
import { useRegisterMutation } from "../../slices/userApi";
import { connectSocket } from "../../socket/socket";
import { useAuthStore } from "../../slices/authStore";

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    occupation: "",
    picture: null,
};

export default function RegisterPage() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const { palette } = useTheme();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const navigate = useNavigate();

    const { setAuth } = useAuthStore();
    const [register, { data, isSuccess, isLoading, error }] =
        useRegisterMutation();

    const handleChange = (e) => {
        setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
        setErrors((s) => ({ ...s, [e.target.name]: undefined }));
    };

    const handleFile = (file) => {
        setValues((s) => ({ ...s, picture: file }));
        setErrors((s) => ({ ...s, picture: undefined }));
    };

    const validate = async () => {
        try {
            await registerSchema.validate(values, { abortEarly: false });
            setErrors({});
            return true;
        } catch (error) {
            const next = {};
            error.inner?.forEach((e) => {
                next[e.path] = e.message;
            });
            setErrors(next);
            return false;
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await validate();
        if (!ok) return;
        setSubmitting(true);
        try {
            const formData = new FormData();

            formData.append("firstName", values.firstName);
            formData.append("lastName", values.lastName);
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("confirmPassword", values.confirmPassword);
            formData.append("location", values.location);
            formData.append("occupation", values.occupation);
            if (values.picture) {
                formData.append("picture", values.picture);
            }
            await register(formData).unwrap();
            resetForm();
        } catch (error) {
            console.error(err);
            setErrors({ form: "Network error" });
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            connectSocket();
            setAuth({ user: data });
            navigate("/home");
        }
    }, [isSuccess, data]);

    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={palette.background.alt}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography fontWeight="bold" fontSize="32px" color="primary">
                    Sociopedia
                </Typography>
            </Box>
            <Box
                width={isNonMobile ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={palette.background.alt}
            >
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": {
                                gridColumn: isNonMobile ? undefined : "span 4",
                            },
                        }}
                    >
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            error={Boolean(errors.firstName)}
                            helperText={errors.firstName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            error={Boolean(errors.lastName)}
                            helperText={errors.lastName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={values.location}
                            onChange={handleChange}
                            error={Boolean(errors.location)}
                            helperText={errors.location}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Occupation"
                            name="occupation"
                            value={values.occupation}
                            onChange={handleChange}
                            error={Boolean(errors.occupation)}
                            helperText={errors.occupation}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <Box
                            gridColumn="span 4"
                            border={`1px solid ${palette.neutral?.medium}`}
                            borderRadius="5px"
                            p="1rem"
                        >
                            <Dropzone
                                acceptFiles=".jpg, .jpeg, .png"
                                multiple={false}
                                onDrop={(acceptedFiles) =>
                                    handleFile(acceptedFiles[0])
                                }
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        sx={{
                                            "&:hover": { cursor: "pointer" },
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        {!values.picture ? (
                                            <p>Add Picture here</p>
                                        ) : (
                                            <FlexBetween>
                                                <Typography>
                                                    {values.picture.name}
                                                </Typography>
                                                <EditOutlinedIcon />
                                            </FlexBetween>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                        </Box>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>
                    {errors.form && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {errors.form}
                        </Typography>
                    )}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            disabled={submitting}
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": {
                                    color: palette.primary.main,
                                    border: `1px solid ${palette.primary.main}`,
                                },
                            }}
                        >
                            Register
                        </Button>
                    </Box>

                    <FlexBetween>
                        <Typography
                            onClick={() => {
                                navigate("/");
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                width: "50%",
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.dark,
                                },
                            }}
                        >
                            Already have an account? Login here.
                        </Typography>
                    </FlexBetween>
                </form>
            </Box>
        </Box>
    );
}
