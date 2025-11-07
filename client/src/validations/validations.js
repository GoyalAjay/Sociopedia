import * as Yup from "yup";

// Login Schema
export const loginSchema = Yup.object({
    email: Yup.string().email("invalid email").required("required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("required"),
});

// Register Schema
export const registerSchema = Yup.object({
    firstName: Yup.string().required("required"),
    lastName: Yup.string().required("required"),
    email: Yup.string().email("invalid email").required("required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Passwords must match"),
    location: Yup.string(),
    occupation: Yup.string(),
    picture: Yup.string(),
});
