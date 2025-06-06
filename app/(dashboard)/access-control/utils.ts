import * as yup from "yup";

export const inviteUsersValidationSchema = yup.object().shape({
  userInvite: yup
    .array()
    .of(
      yup.object().shape({
        email: yup.string().required("Email is required").email("Please enter a valid email address").trim(),
        roleType: yup.string().required("Role is required").oneOf(["Editor", "Reader"], "Please select a valid role"),
        serviceId: yup.string().required("Service is required"),
        servicePlanId: yup.string().required("Subscription plan is required"),
      })
    )
    .min(1, "At least one user invite is required"),
});
