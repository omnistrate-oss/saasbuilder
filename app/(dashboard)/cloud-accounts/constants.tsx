import * as yup from "yup";

export const CloudAccountValidationSchema = yup.object({
  serviceId: yup.string().required("Service ID is required"),
  servicePlanId: yup.string().required("Service Plan ID is required"),
  subscriptionId: yup.string().required("Subscription ID is required"),
});
