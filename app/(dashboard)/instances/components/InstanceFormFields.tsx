import Link from "next/link";
import { Field } from "src/components/DynamicForm/types";
import { Text } from "src/components/Typography/Typography";
import { productTierTypes } from "src/constants/servicePlan";
import {
  getRegionMenuItems,
  getResourceMenuItems,
  getServiceMenuItems,
  getSubscriptionMenuItems,
} from "../utils";
import SubscriptionPlanRadio from "../../components/SubscriptionPlanRadio/SubscriptionPlanRadio";
import CloudProviderRadio from "../../components/CloudProviderRadio/CloudProviderRadio";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import { colors } from "src/themeConfig";

export const getStandardInformationFields = (
  servicesObj,
  serviceOfferings,
  serviceOfferingsObj,
  isFetchingServiceOfferings,
  subscriptions,
  subscriptionsObj,
  isFetchingSubscriptions,
  formData,
  resourceSchema,
  formMode,
  customAvailabilityZones,
  isFetchingCustomAvailabilityZones
) => {
  const { values, setFieldValue, setFieldTouched } = formData;
  const {
    serviceId,
    servicePlanId,
    resourceId,
    cloudProvider,
    region,
    requestParams,
  } = values;

  const serviceMenuItems = getServiceMenuItems(serviceOfferings);

  if (!serviceId) {
    setFieldValue("serviceId", serviceMenuItems[0]?.value || "");
  }

  const subscriptionMenuItems = getSubscriptionMenuItems(
    subscriptions,
    values.servicePlanId
  );

  const resourceMenuItems = getResourceMenuItems(
    serviceOfferingsObj[values.serviceId]?.[values.servicePlanId]
  );

  const inputParametersObj = (resourceSchema?.inputParameters || []).reduce(
    (acc: any, param: any) => {
      acc[param.key] = param;
      return acc;
    },
    {}
  );

  const cloudProviderFieldExists = inputParametersObj["cloud_provider"];
  const regionFieldExists = inputParametersObj["region"];
  const customAvailabilityZoneFieldExists =
    inputParametersObj["custom_availability_zone"];

  const fields: Field[] = [
    {
      label: "Service Name",
      subLabel: "Select the service you want to deploy",
      name: "serviceId",
      type: "select",
      required: true,
      disabled: formMode !== "create",
      emptyMenuText: "No services available",
      isLoading: isFetchingServiceOfferings,
      menuItems: serviceMenuItems,
      onChange: () => {
        setFieldValue("servicePlanId", "");
        setFieldValue("subscriptionId", "");
        setFieldValue("resourceId", "");
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
            serviceOfferingsObj[values.serviceId]?.[values.servicePlanId]
              ?.productTierName
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
      disabled: formMode !== "create",
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
      label: "Resource Type",
      subLabel: "Select the resource",
      name: "resourceId",
      type: "select",
      required: true,
      emptyMenuText: !serviceId
        ? "Select a service"
        : !servicePlanId
          ? "Select a subscription plan"
          : "No resources available",
      menuItems: resourceMenuItems,
      previewValue: () => (
        <Text size="small" weight="medium" color={colors.gray900}>
          {
            resourceMenuItems.find((item) => item.value === values.resourceId)
              ?.label
          }
        </Text>
      ),
    },
  ];

  if (cloudProviderFieldExists) {
    fields.push({
      label: "Cloud Provider",
      subLabel: "Select the cloud provider",
      name: "cloudProvider",
      required: true,
      customComponent: (
        <CloudProviderRadio
          cloudProviders={
            serviceOfferingsObj[serviceId]?.[servicePlanId]?.cloudProviders ||
            []
          }
          name="cloudProvider"
          formData={formData}
          onChange={() => {
            setFieldValue("region", "");
            setFieldTouched("cloudProvider", false);
          }}
          disabled={formMode !== "create"}
        />
      ),
      previewValue: ({ field, formData }) => {
        const cloudProvider = formData.values[field.name];
        return cloudProviderLogoMap[cloudProvider];
      },
    });
  }

  if (regionFieldExists) {
    fields.push({
      label: "Region",
      subLabel: "Select the region",
      name: "region",
      required: true,
      type: "select",
      emptyMenuText: !resourceId
        ? "Select a resource"
        : !cloudProvider
          ? "Select a cloud provider"
          : "No regions available",
      menuItems: getRegionMenuItems(
        serviceOfferingsObj[serviceId]?.[servicePlanId],
        cloudProvider
      ),
    });
  }

  if (customAvailabilityZoneFieldExists) {
    fields.push({
      label: "Custom Availability Zone",
      subLabel: "Select the availability zone",
      description:
        "Select a specific availability zone for deploying your instance",
      name: "requestParams.custom_availability_zone",
      value: requestParams.custom_availability_zone,
      type: "select",
      menuItems: customAvailabilityZones.map((zone) => ({
        label: `${zone.cloudProviderName} - ${zone.code}`,
        value: zone.code,
      })),
      isLoading: isFetchingCustomAvailabilityZones,
      required: true,
      emptyMenuText: region
        ? "No availability zones"
        : "Please select a region first",
      disabled: formMode !== "create",
    });
  }

  return fields;
};

export const getNetworkConfigurationFields = (
  formMode,
  values,
  resourceSchema,
  serviceOfferingsObj
) => {
  const fields: Field[] = [];
  const { serviceId, servicePlanId } = values;
  const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];
  const isMultiTenancy =
    offering?.productTierType === productTierTypes.OMNISTRATE_MULTI_TENANCY;

  const inputParametersObj = (resourceSchema?.inputParameters || []).reduce(
    (acc: any, param: any) => {
      acc[param.key] = param;
      return acc;
    },
    {}
  );

  const cloudProviderFieldExists = inputParametersObj["cloud_provider"];
  const customNetworkFieldExists = inputParametersObj["custom_network_id"];

  const networkTypeFieldExists =
    cloudProviderFieldExists &&
    !isMultiTenancy &&
    offering?.supportsPublicNetwork;

  if (networkTypeFieldExists) {
    fields.push({
      label: "Network",
      subLabel: "Type of Network",
      name: "networkType",
      type: "radio",
      required: true,
      disabled: formMode !== "create",
      options: [
        { label: "Public", value: "PUBLIC" },
        { label: "Internal", value: "INTERNAL" },
      ],
    });
  }

  if (customNetworkFieldExists) {
    fields.push({
      label: "Custom Network ID",
      subLabel: "Select the custom network ID",
      name: "customNetworkId",
      type: "select",
      required: true,
      disabled: formMode !== "create",
      menuItems: [],
      emptyMenuText: "No custom networks available",
    });
  }

  return fields;
};

export const getDeploymentConfigurationFields = (
  formMode,
  values,
  resourceSchema
) => {
  const fields: Field[] = [];
  if (!resourceSchema?.inputParameters) return fields;

  const filteredSchema = resourceSchema?.inputParameters.filter(
    (param) =>
      param.key !== "cloud_provider" &&
      param.key !== "region" &&
      param.key !== "custom_network_id" &&
      param.key !== "custom_availability_zone" &&
      param.key !== "subscriptionId"
  );

  filteredSchema.forEach((param) => {
    if (param.type === "Password") {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key],
        type: "password",
        required: formMode !== "modify" && param.required,
        showPasswordGenerator: true,
        previewValue: () => (
          <Text size="small" weight="medium" color={colors.gray900}>
            *********
          </Text>
        ),
      });
    } else if (
      param.dependentResourceID &&
      param.key !== "cloud_provider_account_config_id"
    ) {
      // TODO: Fix This
      // const dependentResourceId = param.dependentResourceID;
      // const options = resourceIdInstancesHashMap[dependentResourceId]
      //   ? resourceIdInstancesHashMap[dependentResourceId]
      //   : [];
      // fields.push({
      //   label: param.displayName || param.key,
      //   subLabel: param.description,
      //   name: `requestParams.${param.key}`,
      //   value: values.requestParams[param.key],
      //   type: "select",
      //   menuItems: options.map((option) => ({
      //     label: option,
      //     value: option,
      //   })),
      //   required: formMode !== "modify" && param.required,
      //   isLoading: isFetchingResourceInstanceIds,
      // });
    } else if (param.type === "Boolean") {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key],
        type: "radio",
        options: [
          { label: "True", value: "true" },
          { label: "False", value: "false" },
        ],
        required: formMode !== "modify" && param.required,
        previewValue: () => {
          return (
            <Text size="small" weight="medium" color={colors.gray900}>
              {values.requestParams[param.key] === "true" ? "true" : "false"}
            </Text>
          );
        },
      });
    } else if (param.options !== undefined && param.isList === true) {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key],
        type: "multi-select-autocomplete",
        menuItems: param.options.map((option) => ({
          label: option,
          value: option,
        })),
        required: formMode !== "modify" && param.required,
        previewValue: () => {
          return (
            <Text size="small" weight="medium" color={colors.gray900}>
              {values.requestParams[param.key]?.join(", ")}
            </Text>
          );
        },
      });
    } else if (param.options !== undefined && param.isList === false) {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key],
        type: "single-select-autocomplete",
        menuItems: param.options.map((option) => option),
        required: formMode !== "modify" && param.required,
        previewValue: () => {
          return (
            <Text size="small" weight="medium" color={colors.gray900}>
              {values.requestParams[param.key]}
            </Text>
          );
        },
      });
    } else {
      if (
        param.key !== "cloud_provider_native_network_id" ||
        values.cloudProvider !== "gcp"
      ) {
        if (
          param.key === "cloud_provider_account_config_id" ||
          (param.key === "cloud_provider_native_network_id" &&
            values.cloudProvider === "gcp")
        ) {
          return;
        }

        fields.push({
          label: param.displayName || param.key,
          subLabel:
            param.key === "cloud_provider_native_network_id" ? (
              <>
                {param.description && <br />}
                If you&apos;d like to deploy within your VPC, enter its ID.
                Please ensure your VPC meets the{" "}
                <Link
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                  }}
                  href="https://docs.omnistrate.com/usecases/byoa/?#bring-your-own-vpc-byo-vpc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  prerequisites
                </Link>
                .
              </>
            ) : (
              param.description
            ),
          name: `requestParams.${param.key}`,
          value: values.requestParams[param.key],
          type: "text-multiline",
          required: formMode !== "modify" && param.required,
          previewValue: () => {
            return (
              <Text size="small" weight="medium" color={colors.gray900}>
                {values.requestParams[param.key]}
              </Text>
            );
          },
        });
      }
    }
  });

  return fields;
};
