import * as Yup from "yup";

export const IDENTITY_PROVIDER_STATUS_TYPES = {
  READY: "READY",
  PENDING: "PENDING",
  FAILED: "FAILED",
};

export const IDENTITY_PROVIDER_TYPES = {
  Google: "Google",
  GitHub: "GitHub",
};

export const createSigninValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});