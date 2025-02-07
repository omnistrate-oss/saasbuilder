"use client";

import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";

import useLogout from "src/hooks/useLogout";
import { updatePassword } from "src/api/users";
import useSnackbar from "src/hooks/useSnackbar";

import Button from "components/Button/Button";
import Form from "components/FormElementsv2/Form/Form";
import { Text } from "components/Typography/Typography";
import FieldError from "components/FormElementsv2/FieldError/FieldError";
import FieldTitle from "components/FormElementsv2/FieldTitle/FieldTitle";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import { PasswordField } from "components/FormElementsv2/PasswordField/PasswordField";

import FormHeader from "./FormHeader";
import { FieldCell, FieldTitleCell, PasswordValidationSchema } from "./Common";
import { customerUserResetPassword } from "src/api/customer-user";
import { Box, CircularProgress } from "@mui/material";
import Divider from "src/components/Divider/Divider";
import BrokenCircleCheckIcon from "app/(dashboard)/components/Icons/BrokenCircleCheckIcon";

type PasswordFormProps = {
  email: string;
};

const PasswordForm: React.FC<PasswordFormProps> = ({ email }) => {
  const snackbar = useSnackbar();
  const { logout } = useLogout();
  const loggedInUsingSSO = localStorage.getItem("loggedInUsingSSO");

  const isLoggedInUsingSSO = loggedInUsingSSO === "true";

  const updatePasswordMutation = useMutation(
    (data: any) =>
      updatePassword({
        currentPassword: data.currentPassword,
        password: data.newPassword,
      }),
    {
      onSuccess: () => {
        logout();
        snackbar.showSuccess("Password updated successfully");
      },
    }
  );

  const formData = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      const data = { ...values };
      // Remove Empty Fields
      for (const key in data) {
        if (data[key] === "") {
          delete data[key];
        }
      }

      updatePasswordMutation.mutate(data);
    },
    validationSchema: PasswordValidationSchema,
  });

  const { values, handleChange, handleBlur, touched, errors } = formData;

  const setPasswordMutation = useMutation(
    () => {
      const payload = { email: email };
      return customerUserResetPassword(payload);
    },
    {
      onSuccess: () => {
        snackbar.showSuccess(
          "We have emailed you a link to set your password. Please check your email and follow the instructions."
        );
      },
    }
  );

  const handleSetPassword = () => {
    setPasswordMutation.mutate();
  };
  if (!isLoggedInUsingSSO) {
    return (
      <div>
        <FormHeader
          title="Password"
          description="Please enter your current password to change your password"
          className="pb-5 mb-6 border-b border-[#E9EAEB]"
        />

        {/* @ts-ignore */}
        <Form onSubmit={formData.handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-5">
            <FieldTitleCell>
              <FieldTitle required>Current Password</FieldTitle>
            </FieldTitleCell>
            <FieldCell>
              <PasswordField
                name="currentPassword"
                id="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mt: 0 }}
              />
              <FieldError>
                {touched.currentPassword && errors.currentPassword}
              </FieldError>
            </FieldCell>

            <FieldTitleCell>
              <FieldTitle required>New Password</FieldTitle>
            </FieldTitleCell>
            <FieldCell>
              <Text
                size="small"
                weight="regular"
                color="#535862"
                sx={{ mb: "6px" }}
              >
                Your new password must be more than 8 characters
              </Text>
              <PasswordField
                name="newPassword"
                id="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mt: 0 }}
              />
              <FieldError>
                {touched.newPassword && errors.newPassword}
              </FieldError>
            </FieldCell>

            <FieldTitleCell>
              <FieldTitle required>Confirm Password</FieldTitle>
            </FieldTitleCell>
            <FieldCell>
              <PasswordField
                name="confirmPassword"
                id="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mt: 0 }}
              />
              <FieldError>
                {touched.confirmPassword && errors.confirmPassword}
              </FieldError>
            </FieldCell>
          </div>

          <div className="flex items-center justify-end gap-4 mt-5">
            <Button
              variant="outlined"
              onClick={() => formData.resetForm()}
              disabled={updatePasswordMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updatePasswordMutation.isLoading}
            >
              Save
              {updatePasswordMutation.isLoading && <LoadingSpinnerSmall />}
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  if (isLoggedInUsingSSO) {
    return (
      <Box sx={{ Padding: "100px" }} display="flex" flexDirection={"column"}>
        <Box display="flex" justifyContent={"center"}>
          <Box
            display="flex"
            gap={1}
            mt="2px"
            textAlign={"center"}
            alignItems={"center"}
          >
            <BrokenCircleCheckIcon color="#079455" />

            <Text size="xlarge" weight="regular" color="rgba(83, 88, 98, 1)">
              You are currently logged in via Google/Github SSO.
            </Text>
          </Box>
        </Box>
        <Box display="flex" justifyContent={"center"}>
          <Box display="flex" gap={1} mt="2px">
            <Text size="xlarge" weight="regular" color="rgba(83, 88, 98, 1)">
              To setup password-based access, please
            </Text>
            <Button
              onClick={handleSetPassword}
              sx={{
                color: "#7F56D9 !important",
                fontSize: "20px !important",
                lineHeight: "30px !important",
                fontWeight: 700,
                textDecoration: "underline !important",
                textUnderlineOffset: "2px",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "0 !important",
              }}
              disabled={setPasswordMutation.isLoading}
            >
              click here
            </Button>

            <Text size="xlarge" weight="regular" color="rgba(83, 88, 98, 1)">
              to send a setup link
            </Text>
          </Box>
        </Box>
        <Box display="flex" justifyContent={"center"}>
          {setPasswordMutation.isLoading && (
            <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
          )}
        </Box>
        <Divider sx={{ mt: 3, mb: 3 }} />
      </Box>
    );
  }
};

export default PasswordForm;
