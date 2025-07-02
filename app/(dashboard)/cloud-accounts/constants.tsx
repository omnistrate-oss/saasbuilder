import * as yup from "yup";

export const CloudAccountValidationSchema = yup.object({
  serviceId: yup.string().required("Service ID is required"),
  servicePlanId: yup.string().required("Service Plan ID is required"),
  subscriptionId: yup.string().required("Subscription ID is required"),
  cloudProvider: yup.string().required("Cloud Provider is required"),
  accountConfigurationMethod: yup.string().required("Account Configuration Method is required"),
  awsAccountId: yup.string().when("cloudProvider", {
    is: "aws",
    then: yup.string().required("AWS Account ID is required"),
  }),
  gcpProjectId: yup.string().when("cloudProvider", {
    is: "gcp",
    then: yup.string().required("GCP Project ID is required"),
  }),
  gcpProjectNumber: yup.string().when("cloudProvider", {
    is: "gcp",
    then: yup.string().required("GCP Project Number is required"),
  }),
});

export const cloudAccountOffboardingSteps = [
  {
    label: "Initiate Deletion",
    description: "Complete Offboarding",
  },
  {
    label: "Confirm Deletion",
    description: "Confirm Offboarding",
  },
];
