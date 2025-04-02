"use client";

import { useMemo } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CloudAccountValidationSchema } from "../constants";
import { FormConfiguration } from "components/DynamicForm/types";
import GridDynamicForm from "components/DynamicForm/GridDynamicForm";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
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
import { ServiceOffering } from "src/types/serviceOffering";
import { selectUserrootData } from "src/slices/userDataSlice";
import {
  CLOUD_PROVIDERS,
  cloudProviderLogoMap,
} from "src/constants/cloudProviders";

import { getServiceMenuItems } from "app/(dashboard)/instances/utils";
import SubscriptionMenu from "app/(dashboard)/components/SubscriptionMenu/SubscriptionMenu";
import CloudProviderRadio from "app/(dashboard)/components/CloudProviderRadio/CloudProviderRadio";
import SubscriptionPlanRadio from "app/(dashboard)/components/SubscriptionPlanRadio/SubscriptionPlanRadio";
import CustomLabelDescription from "./CustomLabelDescription";
import {
  getInitialValues,
  getValidSubscriptionForInstanceCreation,
} from "../utils";
import {
  ACCOUNT_CREATION_METHOD_LABELS,
  ACCOUNT_CREATION_METHODS,
} from "src/utils/constants/accountConfig";
import { ResourceInstance } from "src/types/resourceInstance";

const CloudAccountForm = ({
  initialFormValues, // These are from URL Params
  onClose,
  formMode,
  selectedInstance,
  setIsAccountCreation,
  setOverlayType,
  setClickedInstance,
  instances,
  isPaymentConfigured,
}) => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  const selectUser = useSelector(selectUserrootData);
  const {
    serviceOfferings,
    isFetchingServiceOfferings,
    servicesObj,
    serviceOfferingsObj,
    subscriptions,
    subscriptionsObj,
    isLoadingSubscriptions,
  } = useGlobalData();

  const allInstances: ResourceInstance[] = instances;
  //subscriptionID -> key, number of instances -> value
  const subscriptionInstanceCountHash: Record<string, number> = {};
  allInstances.forEach((instance) => {
    if (subscriptionInstanceCountHash[instance?.subscriptionId as string]) {
      subscriptionInstanceCountHash[instance.subscriptionId as string] =
        subscriptionInstanceCountHash[instance.subscriptionId as string] + 1;
    } else {
      subscriptionInstanceCountHash[instance.subscriptionId as string] = 1;
    }
  });

  //key-> subscriptionID value-> boolean that indicates if the subscription has reached its quota limit
  const subscriptionQuotaLimitHash: Record<string, boolean> = {};
  subscriptions.forEach((subscription) => {
    const { serviceId, productTierId } = subscription;
    const offering = serviceOfferingsObj[serviceId]?.[productTierId];
    const quotaLimit = offering?.maxNumberOfInstances;
    const instanceCount = subscriptionInstanceCountHash[subscription.id] || 0;
    let hasReachedInstanceQuotaLimit = false;
    if (quotaLimit) {
      hasReachedInstanceQuotaLimit = instanceCount >= quotaLimit;
    }
    subscriptionQuotaLimitHash[subscription.id] = hasReachedInstanceQuotaLimit;
  });

  const byoaServiceOfferings = useMemo(() => {
    return serviceOfferings.filter(
      (offering) =>
        offering.serviceModelType === "BYOA" ||
        offering.serviceModelType === "ON_PREM_COPILOT"
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

  // Find Subscriptions for BYOA Service Offerings
  const byoaSubscriptions = useMemo(() => {
    return subscriptions.filter(
      (sub) => byoaServiceOfferingsObj[sub.serviceId]?.[sub.productTierId]
    );
  }, [subscriptions, byoaServiceOfferingsObj]);

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

      // Sometimes, we don't get the result_params in the response
      // So, we need to update the query data manually
      queryClient.setQueryData(["instances"], (oldData: any) => {
        const result_params = {
          // @ts-ignore
          ...resourceInstance.result_params,
          cloud_provider: values.cloudProvider,
          account_configuration_method: values.accountConfigurationMethod,
        };

        if (values.cloudProvider === "aws") {
          result_params.aws_account_id = values.awsAccountId;
          result_params.aws_bootstrap_role_arn = getAwsBootstrapArn(
            values.awsAccountId
          );
        } else if (values.cloudProvider === "gcp") {
          result_params.gcp_project_id = values.gcpProjectId;
          result_params.gcp_project_number = values.gcpProjectNumber;
          result_params.gcp_service_account_email = getGcpServiceEmail(
            values.gcpProjectId,
            selectUser?.orgId.toLowerCase()
          );
        }

        return {
          ...oldData,
          data: {
            resourceInstances: [
              ...(oldData?.data?.resourceInstances || []),
              {
                ...(resourceInstance || {}),
                result_params: result_params,
              },
            ],
          },
        };
      });

      setIsAccountCreation(true);
      setClickedInstance({
        ...resourceInstance,
        result_params: {
          ...(resourceInstance.result_params || {}),
          account_configuration_method: values.accountConfigurationMethod,
          cloud_provider: values.cloudProvider,
          ...(values.cloudProvider === CLOUD_PROVIDERS.aws
            ? {
                aws_account_id: values.awsAccountId,
              }
            : {
                gcp_project_id: values.gcpProjectId,
                gcp_project_number: values.gcpProjectNumber,
              }),
        },
      });
      setOverlayType("view-instructions-dialog");
      snackbar.showSuccess("Cloud Account created successfully");
    },
  });

  const formData = useFormik({
    initialValues: getInitialValues(
      initialFormValues,
      selectedInstance,
      byoaSubscriptions,
      byoaServiceOfferingsObj,
      byoaServiceOfferings,
      allInstances,
      isPaymentConfigured
    ),
    enableReinitialize: true,
    validationSchema: CloudAccountValidationSchema,
    onSubmit: (values) => {
      const { serviceId, servicePlanId } = values;
      const offering = byoaServiceOfferingsObj[serviceId]?.[servicePlanId];

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
        return snackbar.showError("BYOA Resource not found");
      }

      const data = {
        serviceProviderId: offering.serviceProviderId,
        serviceKey: offering.serviceURLKey,
        serviceAPIVersion: offering.serviceAPIVersion,
        serviceEnvironmentKey: offering.serviceEnvironmentURLKey,
        serviceModelKey: offering.serviceModelURLKey,
        productTierKey: offering.productTierURLKey,
        resourceKey: resource.urlKey,
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
    const subscriptionMenuItems = byoaSubscriptions.filter(
      (sub) => sub.productTierId === servicePlanId
    );

    const accountConfigurationMethods =
      values.cloudProvider === "aws"
        ? [ACCOUNT_CREATION_METHODS.CLOUDFORMATION]
        : [
            ACCOUNT_CREATION_METHODS.GCP_SCRIPT,
            // ACCOUNT_CREATION_METHODS.TERRAFORM,
          ];

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
              dataTestId: "service-name-select",
              label: "Service Name",
              subLabel:
                "Select the service you want to deploy in this cloud account",
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

                const subscription = getValidSubscriptionForInstanceCreation(
                  byoaServiceOfferings,
                  byoaServiceOfferingsObj,
                  byoaSubscriptions,
                  allInstances,
                  isPaymentConfigured,
                  serviceId,
                  true
                );

                const servicePlanId = subscription?.productTierId || "";
                const subscriptionId = subscription?.id || "";

                const offering =
                  byoaServiceOfferingsObj[serviceId]?.[servicePlanId];
                const cloudProvider = offering?.cloudProviders?.[0] || "";

                setFieldValue("servicePlanId", servicePlanId);
                setFieldValue("subscriptionId", subscriptionId);
                setFieldValue("cloudProvider", cloudProvider);
                setFieldValue(
                  "accountConfigurationMethod",
                  cloudProvider === "aws" ? "CloudFormation" : "Terraform"
                );

                // Set Field Touched to False
                formData.setFieldTouched("servicePlanId", false);
                formData.setFieldTouched("subscriptionId", false);
                formData.setFieldTouched("cloudProvider", false);
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
                  onChange={(
                    servicePlanId: string,
                    subscriptionId?: string // This is very specific to when we subscribe to the plan for the first time
                  ) => {
                    const offering =
                      byoaServiceOfferingsObj[serviceId]?.[servicePlanId];

                    const cloudProvider = offering?.cloudProviders?.[0] || "";

                    setFieldValue("cloudProvider", cloudProvider);
                    setFieldValue(
                      "accountConfigurationMethod",
                      cloudProvider === "aws"
                        ? ACCOUNT_CREATION_METHODS.CLOUDFORMATION
                        : ACCOUNT_CREATION_METHODS.GCP_SCRIPT
                    );

                    const filteredSubscriptions = byoaSubscriptions.filter(
                      (sub) => sub.productTierId === servicePlanId
                    );
                    const rootSubscription = filteredSubscriptions.find(
                      (sub) => sub.roleType === "root"
                    );

                    setFieldValue(
                      "subscriptionId",
                      subscriptionId ||
                        rootSubscription?.id ||
                        filteredSubscriptions[0]?.id ||
                        ""
                    );

                    // Set Field Touched to False
                    formData.setFieldTouched("subscriptionId", false);
                    formData.setFieldTouched("cloudProvider", false);
                  }}
                  serviceSubscriptions={subscriptions.filter(
                    (subscription) => subscription.serviceId === serviceId
                  )}
                  isPaymentConfigured={isPaymentConfigured}
                  instances={allInstances}
                  isCloudAccountForm={true}
                />
              ),
              previewValue:
                serviceOfferingsObj[values.serviceId]?.[values.servicePlanId]
                  ?.productTierName,
            },
            {
              dataTestId: "subscription-select",
              label: "Subscription",
              subLabel: "Select the subscription",
              name: "subscriptionId",
              required: true,
              isHidden: subscriptionMenuItems.length <= 1,
              customComponent: (
                <SubscriptionMenu
                  field={{
                    name: "subscriptionId",
                    value: values.subscriptionId,
                    isLoading: isLoadingSubscriptions,
                    disabled: formMode !== "create",
                    emptyMenuText: !serviceId
                      ? "Select a service"
                      : !servicePlanId
                        ? "Select a subscription plan"
                        : "No subscriptions available",
                  }}
                  formData={formData}
                  subscriptions={subscriptionMenuItems}
                  subscriptionQuotaLimitHash={subscriptionQuotaLimitHash}
                  isCloudAccountForm={true}
                />
              ),
              previewValue: subscriptionsObj[values.subscriptionId]?.id,
            },
            {
              label: "Cloud Provider",
              subLabel: "Select the cloud provider",
              name: "cloudProvider",
              required: true,
              isHidden: !serviceId || !servicePlanId,
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
                      cloudProvider === "aws"
                        ? ACCOUNT_CREATION_METHODS.CLOUDFORMATION
                        : ACCOUNT_CREATION_METHODS.GCP_SCRIPT
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
              dataTestId: "account-configuration-method-select",
              label: "Account Configuration Method",
              subLabel:
                "Choose a method from among the options to configure your cloud provider account",
              name: "accountConfigurationMethod",
              type: "select",
              required: true,
              disabled: formMode !== "create",
              isHidden: !cloudProvider,
              menuItems: accountConfigurationMethods.map((option) => ({
                value: option,
                label: ACCOUNT_CREATION_METHOD_LABELS[option],
              })),
              previewValue:
                ACCOUNT_CREATION_METHOD_LABELS[
                  values.accountConfigurationMethod
                ],
            },
            {
              dataTestId: "aws-account-id-input",
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
              dataTestId: "gcp-project-id-input",
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
              dataTestId: "gcp-project-number-input",
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

  if (isFetchingServiceOfferings) {
    return <LoadingSpinner />;
  }

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
