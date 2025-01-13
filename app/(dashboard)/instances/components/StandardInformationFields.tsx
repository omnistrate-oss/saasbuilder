import { useMemo } from "react";

import { Text } from "components/Typography/Typography";
import CardWithTitle from "components/Card/CardWithTitle";
import GridDynamicField from "components/DynamicForm/GridDynamicField";

import {
  getRegionMenuItems,
  getResourceMenuItems,
  getServiceMenuItems,
  getServicePlanMenuItems,
  getSubscriptionMenuItems,
} from "../utils";

import { FormMode } from "src/types/common/enums";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import CloudProviderRadio from "app/(dashboard)/components/CloudProviderRadio/CloudProviderRadio";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import { Field } from "src/components/DynamicForm/types";
import SubscriptionPlanRadio from "app/(dashboard)/components/SubscriptionPlanRadio/SubscriptionPlanRadio";

type StandardInformationFieldsProps = {
  formData: any;
  formMode: FormMode;
  resourceSchema: any;
  isFetchingResourceSchema?: boolean;
  customAvailabilityZones: any[];
  isFetchingCustomAvailabilityZones: boolean;
};

const StandardInformationFields: React.FC<StandardInformationFieldsProps> = ({
  formData,
  formMode,
  resourceSchema,
  isFetchingResourceSchema,
  customAvailabilityZones,
  isFetchingCustomAvailabilityZones,
}) => {
  const {
    servicesObj,
    serviceOfferings,
    serviceOfferingsObj,
    isFetchingServiceOfferings,
    subscriptions,
    subscriptionsObj,
    isFetchingSubscriptions,
  } = useGlobalData();

  const { values, setFieldValue, setFieldTouched } = formData;

  const fields = useMemo(() => {
    const {
      serviceId,
      servicePlanId,
      resourceId,
      cloudProvider,
      region,
      requestParams,
    } = values;

    const serviceMenuItems = getServiceMenuItems(serviceOfferings);

    const servicePlanMenuItems = getServicePlanMenuItems(
      serviceOfferings,
      values.serviceId
    );

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
          <Text size="small" weight="medium" color="#181D27">
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
          <Text size="small" weight="medium" color="#181D27">
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
          <Text size="small" weight="medium" color="#181D27">
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
          <Text size="small" weight="medium" color="#181D27">
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
          return cloudProviderLogoMap[cloudProvider] || "-";
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
  }, [
    formMode,
    values,
    servicesObj,
    serviceOfferings,
    subscriptionsObj,
    subscriptions,
    subscriptionsObj,
    customAvailabilityZones,
  ]);

  return (
    <CardWithTitle title="Standard Information">
      <div className="space-y-6">
        {fields.map((field, index) => {
          return (
            <GridDynamicField key={index} field={field} formData={formData} />
          );
        })}
      </div>
    </CardWithTitle>
  );
};

export default StandardInformationFields;
