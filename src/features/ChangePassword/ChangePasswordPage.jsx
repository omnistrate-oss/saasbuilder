import { useRouter } from "next/router";
import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

import useSnackbar from "src/hooks/useSnackbar";
import axios from "src/axios";

import DisplayHeading from "components/NonDashboardComponents/DisplayHeading";
import PageDescription from "components/NonDashboardComponents/PageDescription";
import SubmitButton from "components/NonDashboardComponents/FormElementsV2/SubmitButton";
import FieldContainer from "components/NonDashboardComponents/FormElementsV2/FieldContainer";
import FieldLabel from "components/NonDashboardComponents/FormElementsV2/FieldLabel";
import PasswordField from "components/NonDashboardComponents/FormElementsV2/PasswordField";
import CenterContentLayout from "components/NonDashboardComponents/Layout/CenterContentLayout";
import { passwordRegex, passwordText } from "src/utils/passwordRegex";
import FieldError from "src/components/FormElementsv2/FieldError/FieldError";

const changePasswordValidationSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .matches(passwordRegex, passwordText),
  confirmPassword: Yup.string()
    .required("Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const ChangePasswordPage = () => {
  const snackbar = useSnackbar();
  const router = useRouter();
  const { email, token } = router.query;

  const changePasswordMutation = useMutation(
    (payload) => {
      return axios.post("/change-password", payload);
    },
    {
      onSuccess: () => {
        /*eslint-disable-next-line no-use-before-define*/
        formik.resetForm();
        snackbar.showSuccess("Change password successful");
        router.push("/signin");
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      changePasswordMutation.mutate({
        email: decodeURIComponent(email),
        token: decodeURIComponent(token),
        password: values.password,
      });
    },
    validationSchema: changePasswordValidationSchema,
  });

  const { values, handleChange, handleBlur, touched, errors } = formik;

  return (
    <CenterContentLayout showLogo pageTitle="Update Password">
      <Stack gap="16px">
        <DisplayHeading>Update your password</DisplayHeading>
        <PageDescription>
          {email && token
            ? "Set your new password with minimum 8 characters with a combination of letters and numbers"
            : "Missing password change credentials. Please check your email and click the link to retry"}
        </PageDescription>
      </Stack>

      {email && token && (
        <Stack component="form" gap="32px">
          {/* Update Password Form */}
          <Stack gap="20px">
            <FieldContainer>
              <FieldLabel required>New Password</FieldLabel>
              <PasswordField
                name="password"
                id="password"
                placeholder="Enter your new password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.password && errors.password}
              </FieldError>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel required>Confirm New Password</FieldLabel>
              <PasswordField
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Re-type your new password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.confirmPassword && errors.confirmPassword}
              </FieldError>
            </FieldContainer>
          </Stack>

          {/* Submit Button */}
          <SubmitButton
            type="submit"
            onClick={formik.handleSubmit}
            disabled={!formik.isValid}
            loading={changePasswordMutation.isLoading}
          >
            Submit
          </SubmitButton>
        </Stack>
      )}
    </CenterContentLayout>
  );
};

export default ChangePasswordPage;
