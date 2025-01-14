"use client";

import { useFormik } from "formik";
import { CloudAccountValidationSchema } from "../constants";
import { FormConfiguration } from "src/components/DynamicForm/types";
import { useMemo } from "react";
import GridDynamicForm from "src/components/DynamicForm/GridDynamicForm";
import { useMutation } from "@tanstack/react-query";
import useSnackbar from "src/hooks/useSnackbar";
import { createResourceInstance } from "src/api/resourceInstance";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import {
  getAwsBootstrapArn,
  getGcpServiceEmail,
} from "src/utils/accountConfig/accountConfig";
import { selectUserrootData } from "src/slices/userDataSlice";
import { useSelector } from "react-redux";
import { Text } from "src/components/Typography/Typography";
import {
  getServiceMenuItems,
  getSubscriptionMenuItems,
} from "app/(dashboard)/instances/utils";
import { colors } from "src/themeConfig";
import SubscriptionPlanRadio from "app/(dashboard)/components/SubscriptionPlanRadio/SubscriptionPlanRadio";
import CloudProviderRadio from "app/(dashboard)/components/CloudProviderRadio/CloudProviderRadio";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import CustomLabelDescription from "./CustomLabelDescription";

const CloudAccountForm = ({ onClose }) => {
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

  const createCloudAccountMutation = useMutation(createResourceInstance, {
    onSuccess: () => {
      onClose();
      snackbar.showSuccess("Cloud Account created successfully");
    },
  });

  const formData = useFormik({
    initialValues: {
      serviceId: "",
      servicePlanId: "",
      subscriptionId: "",
      cloudProvider: "",
      accountConfigurationMethod: "CloudFormation",
      awsAccountId: "",
      gcpProjectId: "",
      gcpProjectNumber: "",
    },
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

      const data = {
        serviceProviderId: offering?.serviceProviderId,
        serviceKey: offering?.serviceURLKey,
        serviceAPIVersion: offering?.serviceAPIVersion,
        serviceEnvironmentKey: offering?.serviceEnvironmentURLKey,
        serviceModelKey: offering?.serviceModelURLKey,
        productTierKey: offering?.productTierURLKey,
        // resourceKey: offering.urlKey,
        subscriptionId: values.subscriptionId,
        cloud_provider: values.cloudProvider,
        requestParams: requestParams,
      };

      console.log(data, offering);
      // createCloudAccountMutation.mutate(data);
    },
  });

  const formConfiguration: FormConfiguration = useMemo(() => {
    const { values, setFieldValue } = formData;
    const { serviceId, servicePlanId } = values;

    const serviceMenuItems = getServiceMenuItems(byoaServiceOfferings);
    const subscriptionMenuItems = getSubscriptionMenuItems(
      subscriptions,
      values.servicePlanId
    );

    if (!serviceId) {
      setFieldValue("serviceId", serviceMenuItems[0]?.value || "");
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
              onChange: () => {
                setFieldValue("servicePlanId", "");
                setFieldValue("subscriptionId", "");
              },
              previewValue: () => (
                <Text size="small" weight="medium" color={colors.gray900}>
                  {servicesObj[values.serviceId]?.serviceName}
                </Text>
              ),
            },
            {
              label: "Subscription Plan",
              subLabel: "Select the subscription plan",
              name: "servicePlanId",
              required: true,
              customComponent: (
                <SubscriptionPlanRadio
                  serviceId={values.serviceId}
                  servicePlanId={values.servicePlanId}
                  name="servicePlanId"
                  formData={formData}
                />
              ),
              previewValue: () => (
                <Text size="small" weight="medium" color={colors.gray900}>
                  {
                    serviceOfferingsObj[values.serviceId]?.[
                      values.servicePlanId
                    ]?.productTierName
                  }
                </Text>
              ),
            },
            {
              label: "Subscription",
              subLabel: "Select the subscription",
              name: "subscriptionId",
              type: "select",
              required: true,
              emptyMenuText: !serviceId
                ? "Select a service"
                : !servicePlanId
                  ? "Select a subscription plan"
                  : "No subscriptions available",
              isLoading: isFetchingSubscriptions,
              menuItems: subscriptionMenuItems,
              previewValue: () => (
                <Text size="small" weight="medium" color={colors.gray900}>
                  {subscriptionsObj[values.subscriptionId]?.id}
                </Text>
              ),
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
                />
              ),
              previewValue: ({ field, formData }) => {
                const cloudProvider = formData.values[field.name];
                return cloudProviderLogoMap[cloudProvider];
              },
            },
            {
              label: "Account Configuration Method",
              subLabel:
                "Choose a method from among the options to configure your cloud provider account",
              name: "method",
              type: "select",
              required: true,
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
              isHidden: values.cloudProvider !== "aws",
            },
            {
              label: "GCP Project ID",
              subLabel: "GCP Project ID to use for the account",
              description: <CustomLabelDescription variant="gcpProjectId" />,
              name: "gcpProjectId",
              type: "text",
              required: true,
              isHidden: values.cloudProvider !== "gcp",
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
              isHidden: values.cloudProvider !== "gcp",
            },
          ],
        },
      ],
    };
  }, [subscriptions, byoaServiceOfferings, formData.values]);

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
