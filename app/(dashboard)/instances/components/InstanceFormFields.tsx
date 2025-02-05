import Link from "next/link";
import { Field } from "src/components/DynamicForm/types";
import { productTierTypes } from "src/constants/servicePlan";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import {
  getCustomNetworksMenuItems,
  getRegionMenuItems,
  getResourceMenuItems,
  getServiceMenuItems,
} from "../utils";

import CloudProviderRadio from "../../components/CloudProviderRadio/CloudProviderRadio";
import SubscriptionPlanRadio from "../../components/SubscriptionPlanRadio/SubscriptionPlanRadio";

import { Subscription } from "src/types/subscription";
import { CustomNetwork } from "src/types/customNetwork";
import { AvailabilityZone } from "src/types/availabilityZone";
import { CloudProvider, FormMode } from "src/types/common/enums";
import { APIEntity, ServiceOffering } from "src/types/serviceOffering";
import SubscriptionMenu from "app/(dashboard)/components/SubscriptionMenu/SubscriptionMenu";
import AccountConfigDescription from "./AccountConfigDescription";

export const getStandardInformationFields = (
  servicesObj,
  serviceOfferings: ServiceOffering[],
  serviceOfferingsObj: Record<string, Record<string, ServiceOffering>>,
  isFetchingServiceOfferings: boolean,
  subscriptions: Subscription[],
  subscriptionsObj: Record<string, Subscription>,
  isFetchingSubscriptions: boolean,
  formData: any,
  resourceSchema: APIEntity,
  formMode: FormMode,
  customAvailabilityZones: AvailabilityZone[],
  isFetchingCustomAvailabilityZones: boolean
) => {
  if (isFetchingServiceOfferings) return [];

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
  const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];

  const subscriptionMenuItems = subscriptions.filter(
    (sub) => sub.productTierId === servicePlanId
  );

  const resourceMenuItems = getResourceMenuItems(
    serviceOfferingsObj[serviceId]?.[servicePlanId]
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
      menuItems: serviceMenuItems,
      onChange: (e) => {
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

        const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];
        const cloudProvider = offering?.cloudProviders?.[0] || "";
        setFieldValue("cloudProvider", cloudProvider);
        if (cloudProvider === "aws") {
          setFieldValue("region", offering.awsRegions?.[0] || "");
        } else if (cloudProvider === "gcp") {
          setFieldValue("region", offering.gcpRegions?.[0] || "");
        } else if (cloudProvider === "azure") {
          // @ts-ignore
          setFieldValue("region", offering.azureRegions?.[0] || "");
        }

        const resources = getResourceMenuItems(offering);
        setFieldValue("resourceId", resources[0]?.value || "");
        setFieldValue("requestParams", {});

        setFieldTouched("servicePlanId", false);
        setFieldTouched("subscriptionId", false);
        setFieldTouched("resourceId", false);
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
          servicePlans={Object.values(
            serviceOfferingsObj[serviceId] || {}
          ).sort((a: any, b: any) =>
            a.productTierName.localeCompare(b.productTierName)
          )}
          name="servicePlanId"
          formData={formData}
          disabled={formMode !== "create"}
          // @ts-ignore
          onChange={(
            servicePlanId: string,
            subscriptionId?: string // This is very specific to when we subscribe to the plan for the first time
          ) => {
            const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];
            const cloudProvider = offering?.cloudProviders?.[0] || "";

            setFieldValue("cloudProvider", cloudProvider);
            if (cloudProvider === "aws") {
              setFieldValue("region", offering.awsRegions?.[0] || "");
            } else if (cloudProvider === "gcp") {
              setFieldValue("region", offering.gcpRegions?.[0] || "");
            } else if (cloudProvider === "azure") {
              // @ts-ignore
              setFieldValue("region", offering.azureRegions?.[0] || "");
            }

            const resources = getResourceMenuItems(offering);
            setFieldValue("resourceId", resources[0]?.value || "");
            setFieldValue("requestParams", {});

            const filteredSubscriptions = subscriptions.filter(
              (sub) =>
                sub.productTierId === servicePlanId &&
                ["root", "editor"].includes(sub.roleType)
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

            setFieldTouched("subscriptionId", false);
            setFieldTouched("resourceId", false);
          }}
        />
      ),
      previewValue: offering?.productTierName,
    },
    {
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
            isLoading: isFetchingSubscriptions,
            disabled: formMode !== "create",
            emptyMenuText: !serviceId
              ? "Select a service"
              : !servicePlanId
                ? "Select a subscription plan"
                : "No subscriptions available",
          }}
          formData={formData}
          subscriptions={subscriptionMenuItems}
        />
      ),
      previewValue: subscriptionsObj[values.subscriptionId]?.id,
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
      previewValue: resourceMenuItems.find(
        (item) => item.value === values.resourceId
      )?.label,
      disabled: formMode !== "create",
      onChange: () => {
        setFieldValue("requestParams", {});
      },
      isHidden: resourceMenuItems.length <= 1,
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
          cloudProviders={offering?.cloudProviders || []}
          name="cloudProvider"
          formData={formData}
          // @ts-ignore
          onChange={(newCloudProvider: CloudProvider) => {
            if (newCloudProvider === "aws") {
              setFieldValue("region", offering.awsRegions?.[0] || "");
            } else if (newCloudProvider === "gcp") {
              setFieldValue("region", offering.gcpRegions?.[0] || "");
            } else if (newCloudProvider === "azure") {
              // @ts-ignore
              setFieldValue("region", offering.azureRegions?.[0] || "");
            }
          }}
          disabled={formMode !== "create"}
        />
      ),
      previewValue: values.cloudProvider
        ? () => {
            const cloudProvider = values.cloudProvider;
            return cloudProviderLogoMap[cloudProvider];
          }
        : null,
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
      disabled: formMode !== "create",
    });
  }

  if (customAvailabilityZoneFieldExists) {
    fields.push({
      label: "Custom Availability Zone",
      subLabel:
        "Select a specific availability zone for deploying your instance",
      name: "requestParams.custom_availability_zone",
      value: requestParams.custom_availability_zone || "",
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
      previewValue: requestParams.custom_availability_zone,
    });
  }

  return fields;
};

export const getNetworkConfigurationFields = (
  formMode: FormMode,
  values,
  resourceSchema: APIEntity,
  serviceOfferingsObj: Record<string, Record<string, ServiceOffering>>,
  customNetworks: CustomNetwork[],
  isFetchingCustomNetworks: boolean
) => {
  const fields: Field[] = [];
  const { serviceId, servicePlanId } = values;
  const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];
  const isMultiTenancy =
    offering?.productTierType === productTierTypes.OMNISTRATE_MULTI_TENANCY;

  const inputParametersObj = (resourceSchema?.inputParameters || []).reduce(
    (acc, param) => {
      acc[param.key] = param;
      return acc;
    },
    {}
  );

  const cloudProviderFieldExists = inputParametersObj["cloud_provider"];
  const customNetworkFieldExists = inputParametersObj["custom_network_id"];
  const cloudProviderNativeNetworkIdFieldExists =
    inputParametersObj["cloud_provider_native_network_id"];
  const customDNSFieldExists = inputParametersObj["custom_dns_configuration"];

  const networkTypeFieldExists =
    cloudProviderFieldExists &&
    !isMultiTenancy &&
    offering?.supportsPublicNetwork;

  if (networkTypeFieldExists) {
    fields.push({
      label: "Network Type",
      subLabel: "Type of Network",
      name: "network_type",
      value: values.network_type || "",
      type: "radio",
      required: true,
      disabled: formMode !== "create",
      options: [
        { label: "Public", value: "PUBLIC", disabled: formMode !== "create" },
        {
          label: "Private",
          value: "INTERNAL",
          disabled: formMode !== "create",
        },
      ],
      previewValue: values.network_type,
    });
  }

  if (customNetworkFieldExists) {
    fields.push({
      label: "Custom Network ID",
      subLabel: "Select the custom network ID",
      name: "requestParams.custom_network_id",
      value: values.requestParams.custom_network_id || "",
      type: "select",
      required: true,
      disabled: formMode !== "create",
      menuItems: getCustomNetworksMenuItems(
        customNetworks,
        values.cloudProvider,
        values.cloudProvider === "aws"
          ? offering.awsRegions
          : values.cloudProvider === "gcp"
            ? offering.gcpRegions
            : // @ts-ignore
              offering.azureRegions || [],
        values.region
      ),
      emptyMenuText: "No custom networks available",
      isLoading: isFetchingCustomNetworks,
      previewValue: customNetworks.find(
        (network) => network.id === values.requestParams.custom_network_id
      )?.name,
    });
  }

  if (
    cloudProviderNativeNetworkIdFieldExists &&
    cloudProviderFieldExists &&
    values.cloudProvider !== "gcp"
  ) {
    const param = inputParametersObj["cloud_provider_native_network_id"];
    fields.push({
      label: param.displayName || param.key,
      subLabel: (
        <>
          {param.description && <br />}
          If you&apos;d like to deploy within your VPC, enter its ID. Please
          ensure your VPC meets the{" "}
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
      ),
      disabled: formMode !== "create",
      name: `requestParams.${param.key}`,
      value: values.requestParams[param.key] || "",
      type: "text-multiline",
      required: formMode !== "modify" && param.required,
      previewValue: values.requestParams[param.key],
    });
  }

  if (customDNSFieldExists) {
    const param = inputParametersObj["custom_dns_configuration"];
    fields.push({
      label: param.displayName || param.key,
      subLabel: param.description,
      disabled: formMode !== "create",
      name: `requestParams.${param.key}`,
      value: values.requestParams[param.key] || "",
      type: "text-multiline",
      required: formMode !== "modify" && param.required,
      previewValue: values.requestParams[param.key],
    });
  }

  return fields;
};

export const getDeploymentConfigurationFields = (
  formMode: FormMode,
  values: any,
  resourceSchema: APIEntity,
  resourceIdInstancesHashMap,
  isFetchingResourceInstanceIds: boolean,
  cloudAccountInstances
) => {
  const fields: Field[] = [];
  if (!resourceSchema?.inputParameters) return fields;

  const filteredSchema = resourceSchema?.inputParameters.filter(
    (param) =>
      param.key !== "cloud_provider" &&
      param.key !== "region" &&
      param.key !== "custom_network_id" &&
      param.key !== "custom_availability_zone" &&
      param.key !== "subscriptionId" &&
      param.key !== "cloud_provider_native_network_id" &&
      param.key !== "custom_dns_configuration"
  );

  filteredSchema.forEach((param) => {
    if (param.type?.toLowerCase() === "password") {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key] || "",
        type: "password",
        required: formMode !== "modify" && param.required,
        showPasswordGenerator: true,
        previewValue: values.requestParams[param.key] ? "********" : "",
        disabled: formMode !== "create" && param.custom && !param.modifiable,
      });
    } else if (
      param.dependentResourceID &&
      param.key !== "cloud_provider_account_config_id"
    ) {
      const dependentResourceId = param.dependentResourceID;
      const options = resourceIdInstancesHashMap[dependentResourceId]
        ? resourceIdInstancesHashMap[dependentResourceId]
        : [];

      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key],
        type: "select",
        menuItems: options.map((option) => ({
          label: option,
          value: option,
        })),
        required: formMode !== "modify" && param.required,
        isLoading: isFetchingResourceInstanceIds,
        emptyMenuText: "No dependent instances available",
        previewValue: values.requestParams[param.key],
        disabled: formMode !== "create" && param.custom && !param.modifiable,
      });
    } else if (param.type?.toLowerCase() === "boolean") {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key] || "",
        type: "radio",
        options: [
          {
            label: "True",
            value: "true",
            disabled:
              formMode !== "create" && param.custom && !param.modifiable,
          },
          {
            label: "False",
            value: "false",
            disabled:
              formMode !== "create" && param.custom && !param.modifiable,
          },
        ],
        required: formMode !== "modify" && param.required,
        previewValue:
          values.requestParams[param.key] === "true" ? "true" : "false",
        disabled: formMode !== "create" && param.custom && !param.modifiable,
      });
    } else if (param.options !== undefined && param.isList === true) {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key] || "",
        type: "multi-select-autocomplete",
        menuItems: param.options.map((option) => ({
          label: option,
          value: option,
        })),
        required: formMode !== "modify" && param.required,
        previewValue: values.requestParams[param.key]?.join(", "),
        disabled: formMode !== "create" && param.custom && !param.modifiable,
      });
    } else if (param.options !== undefined && param.isList === false) {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        value: values.requestParams[param.key] || "",
        type: "single-select-autocomplete",
        menuItems: param.options.map((option) => option),
        required: formMode !== "modify" && param.required,
        previewValue: values.requestParams[param.key],
        disabled: formMode !== "create" && param.custom && !param.modifiable,
      });
    } else if (param.key === "cloud_provider_account_config_id") {
      fields.push({
        label: param.displayName || param.key,
        subLabel: param.description,
        name: `requestParams.${param.key}`,
        description: (
          <AccountConfigDescription
            serviceId={values.serviceId}
            servicePlanId={values.servicePlanId}
            subscriptionId={values.subscriptionId}
          />
        ),
        value: values.requestParams[param.key] || "",
        type: "select",
        menuItems: cloudAccountInstances.map((config) => ({
          label: config.label,
          value: config.id,
        })),
        required: formMode !== "modify" && param.required,
        disabled: formMode !== "create",
        previewValue: cloudAccountInstances.find(
          (config) => config.id === values.requestParams[param.key]
        )?.label,
        emptyMenuText: "No cloud accounts available",
      });
    } else {
      if (param.key === "cloud_provider_account_config_id") {
        return;
      }

      if (
        param.type?.toLowerCase() === "float64" ||
        param.type?.toLowerCase() === "number"
      ) {
        fields.push({
          label: param.displayName || param.key,
          subLabel: param.description,
          name: `requestParams.${param.key}`,
          value: values.requestParams[param.key] || "",
          type: "number",
          required: formMode !== "modify" && param.required,
          previewValue: values.requestParams[param.key],
        });
      } else {
        fields.push({
          label: param.displayName || param.key,
          subLabel: param.description,
          disabled: formMode !== "create" && param.custom && !param.modifiable,
          name: `requestParams.${param.key}`,
          value: values.requestParams[param.key] || "",
          type: "text-multiline",
          required: formMode !== "modify" && param.required,
          previewValue: values.requestParams[param.key],
        });
      }
    }
  });

  return fields;
};
