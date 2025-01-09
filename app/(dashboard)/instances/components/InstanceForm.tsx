"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useMemo } from "react";
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
  getServiceMenuItems,
  getServicePlanMenuItems,
  getSubscriptionMenuItems,
} from "../utils";

const InstanceForm = ({
  formMode,
  onClose,
  selectedInstance,
  refetchResourceInstances,
}) => {
  const snackbar = useSnackbar();
  const {
    subscriptions,
    serviceOfferings,
    serviceOfferingsObj,
    isFetchingSubscriptions,
    isFetchingServiceOfferings,
  } = useGlobalData();

  console.log("subscriptions", serviceOfferings);

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
      resourceKey: selectedInstance?.resourceKey || "",
    },
    onSubmit: (values) => {
      if (formMode === "create") {
        createInstanceMutation.mutate(values);
      } else {
        updateResourceInstanceMutation.mutate(values);
      }
    },
  });

  const formConfiguration: FormConfiguration = useMemo(() => {
    const { values, setFieldValue } = formData;

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
          // TODO: Implement This
        },
      },
      {
        label: "Subscription Plan",
        subLabel: "Select the subscription plan",
        name: "servicePlanId",
        required: true,
        type: "select",
        disabled: formMode !== "create",
        emptyMenuText: "No plans available",
        isLoading: isFetchingServiceOfferings || isFetchingSubscriptions,
        menuItems: getServicePlanMenuItems(serviceOfferings, values.serviceId),
      },
    ];

    const resources =
      serviceOfferingsObj[values.serviceId]?.[values.servicePlanId]
        ?.resourceParameters;

    const subscriptionMenuItems = getSubscriptionMenuItems(
      subscriptions,
      values.servicePlanId
    );

    if (subscriptionMenuItems.length > 1) {
      standardFields.push({
        label: "Subscription",
        subLabel: "Select the subscription",
        name: "subscriptionId",
        type: "select",
        required: true,
        disabled: formMode !== "create",
        emptyMenuText: "No subscriptions available",
        isLoading: isFetchingSubscriptions,
        menuItems: subscriptionMenuItems,
      });
    } else {
      setFieldValue("subscriptionId", subscriptionMenuItems[0]?.value || "");
    }

    const resourceMenuItems =
      resources?.map((resource) => ({
        value: resource.resourceKey,
        label: resource.name,
      })) || [];

    if (resourceMenuItems.length > 1) {
      standardFields.push({
        label: "Resource Type",
        subLabel: "Select the resource",
        name: "resourceKey",
        type: "select",
        required: true,
        emptyMenuText: "No resources available",
        menuItems: resourceMenuItems,
      });
    } else {
      setFieldValue("resourceKey", resourceMenuItems[0]?.value || "");
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
    isFetchingServiceOfferings,
    isFetchingSubscriptions,
    subscriptions,
    formData.values,
    serviceOfferings,
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
