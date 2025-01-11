"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect, useMemo } from "react";
import {
  createResourceInstance,
  getResourceInstanceDetails,
  updateResourceInstance,
} from "src/api/resourceInstance";
import GridDynamicForm from "src/components/DynamicForm/GridDynamicForm";
import { FormConfiguration } from "src/components/DynamicForm/types";
import useSnackbar from "src/hooks/useSnackbar";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import {
  getMainResourceFromInstance,
  getRegionMenuItems,
  getResourceMenuItems,
  getServiceMenuItems,
  getServicePlanMenuItems,
  getSubscriptionMenuItems,
} from "../utils";
import { Text } from "src/components/Typography/Typography";
import useResourceSchema from "../hooks/useResourceSchema";
import CloudProviderRadio from "app/(dashboard)/components/CloudProviderRadio/CloudProviderRadio";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import useAvailabilityZone from "src/hooks/query/useAvailabilityZone";

const InstanceForm = ({
  formMode,
  onClose,
  selectedInstance,
  refetchResourceInstances,
}) => {
  const snackbar = useSnackbar();
  const {
    servicesObj,
    subscriptions,
    serviceOfferings,
    subscriptionsObj,
    serviceOfferingsObj,
    isFetchingSubscriptions,
    isFetchingServiceOfferings,
  } = useGlobalData();

  const selectedSubscription = useMemo(() => {
    return subscriptions.find(
      (sub) => sub.id === selectedInstance?.subscriptionId
    );
  }, [selectedInstance, subscriptions]);

  const createInstanceMutation = useMutation(
    async (payload: any) => {
      const { data } = await createResourceInstance(payload);
      const service =
        serviceOfferingsObj[payload.serviceId]?.[payload.servicePlanId]
          ?.offering;

      // Fetch the New Instance to Update the Query Data
      const instanceData = await getResourceInstanceDetails(
        payload.serviceProviderId,
        payload.serviceKey,
        payload.serviceAPIVersion,
        payload.serviceEnvironmentKey,
        payload.serviceModelKey,
        payload.productTierKey,
        payload.resourceKey,
        data.id,
        payload.subscriptionId
      );

      // This Data will be used to update the Query Data
      return {
        ...instanceData.data,
        serviceProviderId: payload.serviceProviderId,
        serviceURLKey: payload.serviceKey,
        serviceAPIVersion: payload.serviceAPIVersion,
        serviceEnvironmentURLKey: payload.serviceEnvironmentKey,
        serviceModelURLKey: payload.serviceModelKey,
        productTierURLKey: payload.productTierKey,
        resourceKey: payload.resourceKey,
        instanceId: data.id,
        subscriptionId: payload.subscriptionId,
        serviceId: service?.serviceId,
        serviceEnvironmentID: service?.serviceEnvironmentID,
        productTierID: service?.productTierID,
      };
    },
    {
      onSuccess: (res) => {
        snackbar.showSuccess("Instance created successfully");
        // TODO
        // queryClient.setQueryData(["resourceInstances"], (oldData: any) => {
        //   return [res, ...oldData];
        // });
        formData.resetForm();
        onClose();
      },
    }
  );

  const updateResourceInstanceMutation = useMutation(updateResourceInstance, {
    onSuccess: () => {
      refetchResourceInstances();
      formData.resetForm();
      snackbar.showSuccess("Updated Resource Instance");
      onClose();
    },
  });

  const formData = useFormik({
    initialValues: {
      serviceId: selectedSubscription?.serviceId || "",
      servicePlanId: selectedSubscription?.productTierId || "",
      subscriptionId: selectedInstance?.subscriptionId || "",
      resourceId: getMainResourceFromInstance(selectedInstance)?.id || "",
      cloudProvider: selectedInstance?.cloudProvider || "",
      region: selectedInstance?.region || "",
      requestParams: {
        ...(selectedInstance?.result_params || {}),
      },
    },
    onSubmit: (values) => {
      if (formMode === "create") {
        createInstanceMutation.mutate(values);
      } else {
        updateResourceInstanceMutation.mutate(values);
      }
    },
  });

  const {
    data: resourceSchemaData = {},
    isFetching: isFetchingResourceSchema,
  }: any = useResourceSchema({
    serviceId: formData.values.serviceId,
    resourceId: formData.values.resourceId,
    instanceId: selectedInstance?.id,
  });

  const {
    data: customAvailabilityZoneData,
    isLoading: isFetchingCustomAvailabilityZones,
  } = useAvailabilityZone(
    formData.values.region,
    formData.values.cloudProvider
  );

  console.log(formData.values);

  // Sets the Default Values for the Request Parameters
  useEffect(() => {
    const inputParameters = resourceSchemaData?.inputParameters || [];

    const defaultValues = inputParameters.reduce((acc: any, param: any) => {
      acc[param.key] = param.defaultValue || "";
      return acc;
    }, {});

    if (inputParameters.length && formMode === "create") {
      formData.setValues((prev) => ({
        ...prev,
        requestParams: defaultValues,
      }));
    }
  }, [resourceSchemaData, formMode]);

  const customAvailabilityZones = useMemo(() => {
    const availabilityZones = customAvailabilityZoneData?.availabilityZones;
    return availabilityZones?.sort(function (a, b) {
      if (a.code < b.code) return -1;
      else if (a.code > b.code) {
        return 1;
      }
      return -1;
    });
  }, [customAvailabilityZoneData?.availabilityZones]);

  const formConfiguration: FormConfiguration = useMemo(() => {
    const { values, setFieldValue } = formData;

    const {
      serviceId,
      servicePlanId,
      resourceId,
      cloudProvider,
      region,
      requestParams,
    } = values;

    const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];

    const standardFields: any[] = [
      {
        label: "Service Name",
        subLabel: "Select the service you want to deploy",
        name: "serviceId",
        type: "select",
        required: true,
        disabled: formMode !== "create",
        emptyMenuText: "No services available",
        isLoading: isFetchingServiceOfferings,
        menuItems: getServiceMenuItems(serviceOfferings),
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
        type: "select",
        disabled: formMode !== "create",
        emptyMenuText: !serviceId ? "Select a service" : "No plans available",
        isLoading: isFetchingServiceOfferings || isFetchingSubscriptions,
        menuItems: getServicePlanMenuItems(serviceOfferings, values.serviceId),
        previewValue: () => (
          <Text size="small" weight="medium" color="#181D27">
            {
              serviceOfferingsObj[values.serviceId]?.[values.servicePlanId]
                ?.productTierName
            }
          </Text>
        ),
      },
    ];

    const subscriptionMenuItems = getSubscriptionMenuItems(
      subscriptions,
      values.servicePlanId
    );

    standardFields.push({
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
    });

    if (subscriptionMenuItems.length === 1) {
      setFieldValue("subscriptionId", subscriptionMenuItems[0]?.value || "");
    }

    const resourceMenuItems = getResourceMenuItems(
      serviceOfferingsObj[values.serviceId]?.[values.servicePlanId]
    );

    standardFields.push({
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
    });

    if (resourceMenuItems.length === 1) {
      setFieldValue("resourceId", resourceMenuItems[0]?.value || "");
    }

    const inputParametersObj = (
      resourceSchemaData?.inputParameters || []
    ).reduce((acc: any, param: any) => {
      acc[param.key] = param;
      return acc;
    }, {});

    const cloudProviderFieldExists = inputParametersObj["cloud_provider"];
    const regionFieldExists = inputParametersObj["region"];
    const customAvailabilityZoneFieldExists =
      inputParametersObj["custom_availability_zone"];

    if (cloudProviderFieldExists) {
      standardFields.push({
        label: "Cloud Provider",
        subLabel: "Select the cloud provider",
        name: "cloudProvider",
        required: true,
        customComponent: (
          <CloudProviderRadio
            cloudProviders={
              serviceOfferingsObj[values.serviceId]?.[values.servicePlanId]
                ?.cloudProviders || []
            }
            name="cloudProvider"
            formData={formData}
            onChange={() => {
              formData.setFieldValue("region", "");
              formData.setFieldTouched("cloudProvider", false);
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
      standardFields.push({
        label: "Region",
        subLabel: "Select the region",
        name: "requestParams.region",
        value: values.requestParams.region,
        required: true,
        type: "select",
        emptyMenuText: !resourceId
          ? "Select a resource"
          : !cloudProvider
            ? "Select a cloud provider"
            : "No regions available",
        menuItems: getRegionMenuItems(offering, cloudProvider),
      });
    }

    if (customAvailabilityZoneFieldExists) {
      standardFields.push({
        label: "Custom Availability Zone",
        description:
          "Select a specific availability zone for deploying your instance",
        name: "requestParams.custom_availability_zone",
        value: values.requestParams.custom_availability_zone,
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

    return {
      title: {
        create: "Create Deployment Instance",
        modify: "Modify Deployment Instance",
      },
      description: {
        create: "Configure and launch a new instance of your service",
        modify: "Modify your existing instance",
      },
      footer: {
        submitButton: {
          create: "Create",
          modify: "Update",
        },
      },
      sections: [
        {
          title: "Standard Information",
          fields: standardFields,
        },
      ],
    };
  }, [
    formMode,
    subscriptions,
    serviceOfferings,
    formData.values,
    isFetchingSubscriptions,
    isFetchingServiceOfferings,
    resourceSchemaData?.inputParameters,
    customAvailabilityZones,
    isFetchingCustomAvailabilityZones,
  ]);

  return (
    <GridDynamicForm
      formConfiguration={formConfiguration}
      formMode={formMode}
      formData={formData}
      onClose={onClose}
      isFormSubmitting={
        createInstanceMutation.isLoading ||
        updateResourceInstanceMutation.isLoading
      }
      previewCardTitle="Deployment Instance Summary"
    />
  );
};

export default InstanceForm;
