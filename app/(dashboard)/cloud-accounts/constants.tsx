import * as yup from "yup";

export const CloudAccountValidationSchema = yup.object({
  serviceId: yup.string().required("Service ID is required"),
  servicePlanId: yup.string().required("Service Plan ID is required"),
  subscriptionId: yup.string().required("Subscription ID is required"),
  cloudProvider: yup.string().required("Cloud Provider is required"),
  accountConfigurationMethod: yup
    .string()
    .required("Account Configuration Method is required"),
});
