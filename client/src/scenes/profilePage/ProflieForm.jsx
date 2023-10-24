import {
    Box,
    Button,
    Divider,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import { setLogin } from "state";

const userProfileSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
});

var initialValuesUserProfile = {
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    occupation: "",
};

const ProfileForm = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    initialValuesUserProfile = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        occupation: user.occupation,
    };

    const profileUpdate = async (values) => {
        const profileUpdateResponse = await fetch(
            `/auth/profileUpdate/${userId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            }
        );
        const updatedUser = await profileUpdateResponse.json();
        if (updatedUser) {
            dispatch(
                setLogin({
                    user: updatedUser,
                    token: token,
                })
            );
        }
        navigate("/home");
    };
    const goback = () => {
        navigate(`/home`);
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="0.5rem" pb="1.1rem">
                <FlexBetween gap="1rem">
                    <UserImage image={user.picturePath} size="150" />
                    <Box>
                        <Typography
                            variant="h4"
                            color={palette.neutral.dark}
                            fontSize="2rem"
                            fontWeight="900"
                            sx={{
                                "&:hover": palette.primary.light,
                            }}
                        >
                            {user.firstName} {user.lastName}
                        </Typography>
                    </Box>
                </FlexBetween>
            </FlexBetween>

            <Divider />
            <Formik
                onSubmit={profileUpdate}
                initialValues={initialValuesUserProfile}
                validationSchema={userProfileSchema}
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
                                marginTop: "2rem",
                                "& > div": {
                                    gridColumn: isNonMobile
                                        ? undefined
                                        : "span 4",
                                },
                            }}
                        >
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
                                helperText={touched.lastName && errors.lastName}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                disabled
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
                                label="Location"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.location}
                                name="location"
                                error={
                                    Boolean(touched.location) &&
                                    Boolean(errors.location)
                                }
                                helperText={touched.location && errors.location}
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

                            {/* BUTTONS */}
                            <Button
                                fullWidth
                                onClick={goback}
                                sx={{
                                    m: "2rem 0",
                                    p: "1rem",
                                    backgroundColor: palette.background.alt,
                                    color: palette.primary.dark,
                                    border: `1px solid ${palette.primary.dark}`,
                                    "&:hover": {
                                        color: palette.background.alt,
                                        backgroundColor: palette.primary.dark,
                                    },
                                }}
                            >
                                Cancel
                            </Button>
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
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </WidgetWrapper>
    );
};

export default ProfileForm;
