"use client";

import { useMemo } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import { CloudAccountValidationSchema } from "../constants";
import { FormConfiguration } from "components/DynamicForm/types";
import GridDynamicForm from "components/DynamicForm/GridDynamicForm";
import useSnackbar from "src/hooks/useSnackbar";
import {
  createResourceInstance,
  getResourceInstanceDetails,
} from "src/api/resourceInstance";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import {
  getAwsBootstrapArn,
  getGcpServiceEmail,
} from "src/utils/accountConfig/accountConfig";
import { selectUserrootData } from "src/slices/userDataSlice";
import {
  getServiceMenuItems,
  getSubscriptionMenuItems,
} from "app/(dashboard)/instances/utils";
import SubscriptionPlanRadio from "app/(dashboard)/components/SubscriptionPlanRadio/SubscriptionPlanRadio";
import CloudProviderRadio from "app/(dashboard)/components/CloudProviderRadio/CloudProviderRadio";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import CustomLabelDescription from "./CustomLabelDescription";
import { ServiceOffering } from "src/types/serviceOffering";
import { getInitialValues } from "../utils";

const CloudAccountForm = ({
  onClose,
  formMode,
  selectedInstance,
  refetchInstances,
  setIsAccountCreation,
  setOverlayType,
  setClickedInstance,
}) => {
  const snackbar = useSnackbar();
  const selectUser = useSelector(selectUserrootData);
  const {
    serviceOfferings,
    isFetchingServiceOfferings,
    servicesObj,
    serviceOfferingsObj,
    subscriptions,
    subscriptionsObj,
    isFetchingSubscriptions,
  } = useGlobalData();

  const byoaServiceOfferings = useMemo(() => {
    return serviceOfferings.filter(
      (offering) => offering.serviceModelType === "BYOA"
    );
  }, [serviceOfferings]);

  const byoaServiceOfferingsObj: Record<
    string,
    Record<string, ServiceOffering>
  > = useMemo(() => {
    return byoaServiceOfferings.reduce((acc, offering) => {
      acc[offering.serviceId] = acc[offering.serviceId] || {};
      acc[offering.serviceId][offering.productTierID] = offering;
      return acc;
    }, {});
  }, [byoaServiceOfferings]);

  const createCloudAccountMutation = useMutation(createResourceInstance, {
    onSuccess: async (response: any) => {
      const values = formData.values;
      const instanceId = response.data.id;
      const { serviceId, servicePlanId } = values;
      const offering = byoaServiceOfferingsObj[serviceId]?.[servicePlanId];
      const selectedResource = offering?.resourceParameters.find((resource) =>
        resource.resourceId.startsWith("r-injectedaccountconfig")
      );

      const resourceInstanceResponse = await getResourceInstanceDetails(
        offering?.serviceProviderId,
        offering?.serviceURLKey,
        offering?.serviceAPIVersion,
        offering?.serviceEnvironmentURLKey,
        offering?.serviceModelURLKey,
        offering?.productTierURLKey,
        selectedResource?.urlKey,
        instanceId,
        values.subscriptionId
      );

      const resourceInstance = resourceInstanceResponse.data;

      refetchInstances();
      setIsAccountCreation(true);
      setClickedInstance(resourceInstance);
      setOverlayType("view-instructions-dialog");
      snackbar.showSuccess("Cloud Account created successfully");
    },
  });

  const formData = useFormik({
    initialValues: getInitialValues(
      selectedInstance,
      formMode,
      subscriptionsObj
    ),
    validationSchema: CloudAccountValidationSchema,
    onSubmit: (values) => {
      const { serviceId, servicePlanId } = values;
      const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];

      let requestParams: Record<string, any>;
      if (values.cloudProvider === "aws") {
        requestParams = {
          cloud_provider: values.cloudProvider,
          aws_account_id: values.awsAccountId,
          account_configuration_method: values.accountConfigurationMethod,
          aws_bootstrap_role_arn: getAwsBootstrapArn(values.awsAccountId),
        };
      } else {
        requestParams = {
          cloud_provider: values.cloudProvider,
          gcp_project_id: values.gcpProjectId,
          gcp_project_number: values.gcpProjectNumber,
          account_configuration_method: values.accountConfigurationMethod,
          gcp_service_account_email: getGcpServiceEmail(
            values.gcpProjectId,
            selectUser?.orgId.toLowerCase()
          ),
        };
      }

      const resource = offering?.resourceParameters.find((resource) =>
        resource.resourceId.startsWith("r-injectedaccountconfig")
      );

      if (!resource) {
        return snackbar.showError("Resource not found");
      }

      const data = {
        serviceProviderId: offering?.serviceProviderId,
        serviceKey: offering?.serviceURLKey,
        serviceAPIVersion: offering?.serviceAPIVersion,
        serviceEnvironmentKey: offering?.serviceEnvironmentURLKey,
        serviceModelKey: offering?.serviceModelURLKey,
        productTierKey: offering?.productTierURLKey,
        resourceKey: resource?.urlKey,
        subscriptionId: values.subscriptionId,
        cloud_provider: values.cloudProvider,
        requestParams: requestParams,
      };

      createCloudAccountMutation.mutate(data);
    },
  });

  const { values, setFieldValue } = formData;

  const formConfiguration: FormConfiguration = useMemo(() => {
    const { serviceId, servicePlanId, cloudProvider } = values;

    const serviceMenuItems = getServiceMenuItems(byoaServiceOfferings);
    const subscriptionMenuItems = getSubscriptionMenuItems(
      subscriptions,
      values.servicePlanId
    );

    // Initialise the Form
    if (!values.serviceId) {
      const filteredSubscriptions = subscriptions.filter(
        (sub) => byoaServiceOfferingsObj[sub.serviceId]?.[sub.productTierId]
      );

      const rootSubscription = filteredSubscriptions.find(
        (sub) => sub.roleType === "root"
      );

      const serviceId =
        rootSubscription?.serviceId ||
        filteredSubscriptions[0]?.serviceId ||
        "";
      const servicePlanId =
        rootSubscription?.productTierId ||
        filteredSubscriptions[0]?.productTierId ||
        "";

      setFieldValue("serviceId", serviceId);
      setFieldValue("servicePlanId", servicePlanId);
      setFieldValue(
        "subscriptionId",
        rootSubscription?.id || filteredSubscriptions[0]?.id || ""
      );

      const cloudProvider =
        byoaServiceOfferingsObj[serviceId]?.[servicePlanId]
          ?.cloudProviders?.[0] || "";

      setFieldValue("cloudProvider", cloudProvider);
      setFieldValue(
        "accountConfigurationMethod",
        cloudProvider === "aws" ? "CloudFormation" : "Terraform"
      );
    }

    const accountConfigurationMethods =
      values.cloudProvider === "aws"
        ? ["CloudFormation", "Terraform"]
        : ["Terraform"];

    return {
      footer: {
        submitButton: {
          create: "Create",
        },
      },
      sections: [
        {
          title: "Standard Information",
          fields: [
            {
              label: "Service Name",
              subLabel: "Select the service you want to deploy",
              name: "serviceId",
              type: "select",
              required: true,
              emptyMenuText: "No services available",
              isLoading: isFetchingServiceOfferings,
              menuItems: serviceMenuItems,
              disabled: formMode !== "create",
              onChange: (e) => {
                // When Service ID Changes
                // Find the First Service Plan for which we have a Subscription and Select It
                // Otherwise, Reset the Service Plan and Subscription

                const serviceId = e.target.value;
                const filteredSubscriptions = subscriptions.filter(
                  (sub) =>
                    sub.serviceId === serviceId &&
                    ["root", "editor"].includes(sub.roleType)
                );
                const rootSubscription = filteredSubscriptions.find(
                  (sub) => sub.roleType === "root"
                );

                const servicePlanId =
                  rootSubscription?.productTierId ||
                  filteredSubscriptions[0]?.productTierId ||
                  "";
                const subscriptionId =
                  rootSubscription?.id || filteredSubscriptions[0]?.id || "";

                setFieldValue("servicePlanId", servicePlanId);
                setFieldValue("subscriptionId", subscriptionId);

                const offering =
                  byoaServiceOfferingsObj[serviceId]?.[servicePlanId];
                const cloudProvider = offering?.cloudProviders?.[0] || "";
                setFieldValue("cloudProvider", cloudProvider);
                setFieldValue(
                  "accountConfigurationMethod",
                  cloudProvider === "aws" ? "CloudFormation" : "Terraform"
                );
              },
              previewValue: servicesObj[values.serviceId]?.serviceName,
            },
            {
              label: "Subscription Plan",
              subLabel: "Select the subscription plan",
              name: "servicePlanId",
              required: true,
              customComponent: (
                <SubscriptionPlanRadio
                  disabled={formMode !== "create"}
                  servicePlans={Object.values(
                    byoaServiceOfferingsObj[serviceId] || {}
                  ).sort((a, b) =>
                    a.productTierName.localeCompare(b.productTierName)
                  )}
                  name="servicePlanId"
                  formData={formData}
                  // @ts-ignore
                  onChange={(servicePlanId: string) => {
                    const offering =
                      byoaServiceOfferingsObj[serviceId]?.[servicePlanId];

                    const cloudProvider = offering?.cloudProviders?.[0] || "";

                    setFieldValue("cloudProvider", cloudProvider);
                    setFieldValue(
                      "accountConfigurationMethod",
                      cloudProvider === "aws" ? "CloudFormation" : "Terraform"
                    );

                    const filteredSubscriptions = subscriptions.filter(
                      (sub) => sub.productTierId === servicePlanId
                    );
                    const rootSubscription = filteredSubscriptions.find(
                      (sub) => sub.roleType === "root"
                    );

                    setFieldValue(
                      "subscriptionId",
                      rootSubscription?.id || filteredSubscriptions[0]?.id || ""
                    );
                  }}
                />
              ),
              previewValue:
                serviceOfferingsObj[values.serviceId]?.[values.servicePlanId]
                  ?.productTierName,
            },
            {
              label: "Subscription",
              subLabel: "Select the subscription",
              name: "subscriptionId",
              type: "select",
              required: true,
              disabled: formMode !== "create",
              emptyMenuText: !serviceId
                ? "Select a service"
                : !servicePlanId
                  ? "Select a subscription plan"
                  : "No subscriptions available",
              isLoading: isFetchingSubscriptions,
              menuItems: subscriptionMenuItems,
              previewValue: subscriptionsObj[values.subscriptionId]?.id,
            },
            {
              label: "Cloud Provider",
              subLabel: "Select the cloud provider",
              name: "cloudProvider",
              required: true,
              customComponent: (
                <CloudProviderRadio
                  cloudProviders={
                    serviceOfferingsObj[serviceId]?.[servicePlanId]
                      ?.cloudProviders || []
                  }
                  name="cloudProvider"
                  formData={formData}
                  // @ts-ignore
                  onChange={(cloudProvider: string) => {
                    setFieldValue(
                      "accountConfigurationMethod",
                      cloudProvider === "aws" ? "CloudFormation" : "Terraform"
                    );
                  }}
                  disabled={formMode !== "create"}
                />
              ),
              previewValue: !cloudProvider
                ? null
                : () => {
                    const cloudProvider = values.cloudProvider;
                    return cloudProviderLogoMap[cloudProvider];
                  },
            },
            {
              label: "Account Configuration Method",
              subLabel:
                "Choose a method from among the options to configure your cloud provider account",
              name: "accountConfigurationMethod",
              type: "select",
              required: true,
              disabled: formMode !== "create",
              menuItems: accountConfigurationMethods.map((option) => ({
                value: option,
                label:
                  option === "CloudFormation"
                    ? "CloudFormation (recommended)"
                    : "Terraform",
              })),
            },
            {
              label: "AWS Account ID",
              subLabel: "AWS Account ID to use for the account",
              description: <CustomLabelDescription variant="aws" />,
              name: "awsAccountId",
              type: "text",
              required: true,
              disabled: formMode !== "create",
              isHidden: values.cloudProvider !== "aws",
              previewValue:
                cloudProvider === "aws" ? values.awsAccountId : null,
            },
            {
              label: "GCP Project ID",
              subLabel: "GCP Project ID to use for the account",
              description: <CustomLabelDescription variant="gcpProjectId" />,
              name: "gcpProjectId",
              type: "text",
              required: true,
              disabled: formMode !== "create",
              isHidden: values.cloudProvider !== "gcp",
              previewValue:
                cloudProvider === "gcp" ? values.gcpProjectId : null,
            },
            {
              label: "GCP Project Number",
              subLabel: "GCP Project Number to use for the account",
              description: (
                <CustomLabelDescription variant="gcpProjectNumber" />
              ),
              name: "gcpProjectNumber",
              type: "text",
              required: true,
              disabled: formMode !== "create",
              isHidden: values.cloudProvider !== "gcp",
              previewValue:
                cloudProvider === "gcp" ? values.gcpProjectNumber : null,
            },
          ],
        },
      ],
    };
  }, [formMode, subscriptions, byoaServiceOfferings, values]);

  return (
    <GridDynamicForm
      formConfiguration={formConfiguration}
      formData={formData}
      formMode="create"
      onClose={onClose}
      isFormSubmitting={createCloudAccountMutation.isLoading}
      previewCardTitle="Cloud Account Summary"
    />
  );
};

export default CloudAccountForm;
