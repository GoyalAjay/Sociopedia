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
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useLoginMutation } from "../../slices/userApi";

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    occupation: "",
    picture: "",
};

const initialValueLogin = {
    email: "",
    password: "",
};

const passwordResetEmailSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
});

export const initialEmailPasswordReset = {
    email: "",
};

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const isForgetPassword = pageType === "forgetPassword";

    const register = async (values, onSubmitProps) => {
        // this allows us to send form info with image.
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value]);
        }
        if (values.picture) {
            formData.append("picturePath", values.picture.name);
        }

        const savedUserResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/auth/register`,
            {
                method: "POST",
                body: formData,
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            setPageType("login");
        }
    };

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();

        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            navigate("/home");
        }
    };

    const forgetPassword = async (values, onSubmitProps) => {
        const forgetPasswordResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/auth/forgetPasswordMail`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const data = await forgetPasswordResponse.json();
        onSubmitProps.resetForm();
        if (data) {
            setPageType("login");
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
        if (isForgetPassword) await forgetPassword(values, onSubmitProps);
    };
    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={
                isLogin
                    ? initialValueLogin
                    : isRegister
                    ? initialValuesRegister
                    : initialEmailPasswordReset
            }
            validationSchema={
                isLogin
                    ? loginSchema
                    : isRegister
                    ? registerSchema
                    : passwordResetEmailSchema
            }
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
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
                        {isRegister && (
                            <>
                                <TextField
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={
                                        Boolean(touched.firstName) &&
                                        Boolean(errors.firstName)
                                    }
                                    helperText={
                                        touched.firstName && errors.firstName
                                    }
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={
                                        Boolean(touched.lastName) &&
                                        Boolean(errors.lastName)
                                    }
                                    helperText={
                                        touched.lastName && errors.lastName
                                    }
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={
                                        Boolean(touched.location) &&
                                        Boolean(errors.location)
                                    }
                                    helperText={
                                        touched.location && errors.location
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Occupation"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name="occupation"
                                    error={
                                        Boolean(touched.occupation) &&
                                        Boolean(errors.occupation)
                                    }
                                    helperText={
                                        touched.occupation && errors.occupation
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <Box
                                    gridColumn="span 4"
                                    border={`1px solid ${palette.neutral.medium}`}
                                    borderRadius="5px"
                                    p="1rem"
                                >
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onDrop={(acceptedFiles) =>
                                            setFieldValue(
                                                "picture",
                                                acceptedFiles[0]
                                            )
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()}
                                                border={`2px dashed ${palette.primary.main}`}
                                                p="1rem"
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                    },
                                                }}
                                            >
                                                <input {...getInputProps()} />
                                                {!values.picture ? (
                                                    <p>Add Picture Here</p>
                                                ) : (
                                                    <FlexBetween>
                                                        <Typography>
                                                            {
                                                                values.picture
                                                                    .name
                                                            }
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
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={
                                        Boolean(touched.email) &&
                                        Boolean(errors.email)
                                    }
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={
                                        Boolean(touched.password) &&
                                        Boolean(errors.password)
                                    }
                                    helperText={
                                        touched.password && errors.password
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirmPassword}
                                    name="confirmPassword"
                                    error={
                                        Boolean(touched.confirmPassword) &&
                                        Boolean(errors.confirmPassword)
                                    }
                                    helperText={
                                        touched.confirmPassword &&
                                        errors.confirmPassword
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </>
                        )}
                        {isLogin && (
                            <>
                                <TextField
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={
                                        Boolean(touched.email) &&
                                        Boolean(errors.email)
                                    }
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={
                                        Boolean(touched.password) &&
                                        Boolean(errors.password)
                                    }
                                    helperText={
                                        touched.password && errors.password
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </>
                        )}

                        {isForgetPassword && (
                            <TextField
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={
                                    Boolean(touched.email) &&
                                    Boolean(errors.email)
                                }
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: "span 4" }}
                            />
                        )}
                    </Box>

                    {/* BUTTONS */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
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
                            {isLogin
                                ? "LOGIN"
                                : isRegister
                                ? "REGISTER"
                                : "SEND EMAIL"}
                        </Button>
                    </Box>
                    <FlexBetween>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
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
                            {isLogin
                                ? "Don't have an account? Sign up here."
                                : isRegister
                                ? "Already have an account? Login here."
                                : "Remember your password? Login here."}
                        </Typography>
                        {isLogin && (
                            <Typography
                                onClick={() => {
                                    setPageType("forgetPassword");
                                    resetForm();
                                }}
                                sx={{
                                    textDecoration: "underline",
                                    color: palette.primary.main,
                                    "&:hover": {
                                        cursor: "pointer",
                                        color: palette.primary.dark,
                                    },
                                }}
                            >
                                Forget Password?
                            </Typography>
                        )}
                    </FlexBetween>
                </form>
            )}
        </Formik>
    );
};

export default Form;
