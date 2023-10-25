import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
// import FlexBetween from "components/FlexBetween";

const passwordResetSchema = yup.object().shape({
    password: yup.string().required("required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Passwords must match"),
});

export const initialPasswordReset = {
    password: "",
    confirmPassword: "",
};

const ResetForm = () => {
    const { palette } = useTheme();
    const { randomId } = useParams();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");

    const PasswordReset = async (values, onSubmitProps) => {
        const passwordResetResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/auth/passwordReset/${randomId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const data = await passwordResetResponse.json();
        console.log(data);
        onSubmitProps.resetForm();
        navigate("/");
    };

    return (
        <Formik
            onSubmit={PasswordReset}
            initialValues={initialPasswordReset}
            validationSchema={passwordResetSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
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
                            helperText={touched.password && errors.password}
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
                    </Box>

                    {/* BUTTON */}
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
                            RESET PASSWORD
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default ResetForm;
