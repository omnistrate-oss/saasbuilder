"use client";

import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import CloudProviderRadio from "app/(dashboard)/components/CloudProviderRadio/CloudProviderRadio";
import { useFormik } from "formik";

import { createCustomNetwork, updateCustomNetwork } from "src/api/customNetworks";
import { cloudProviderLongLogoMap } from "src/constants/cloudProviders";
import useSnackbar from "src/hooks/useSnackbar";
import { UpdateCustomNetworkRequestBody } from "src/types/customNetwork";
import GridDynamicForm from "components/DynamicForm/GridDynamicForm";
import { FormConfiguration } from "components/DynamicForm/types";

import { CustomNetworkValidationSchema } from "../constants";

const CustomNetworkForm = ({
  formMode,
  regions,
  isFetchingRegions,
  refetchCustomNetworks,
  onClose,
  selectedCustomNetwork,
}) => {
  const snackbar = useSnackbar();
  const createCustomNetworkMutation = useMutation({
    mutationFn: createCustomNetwork,
    onSuccess: async () => {
      onClose();
      snackbar.showSuccess("Customer Network created successfully");
      refetchCustomNetworks();
    },
  });

  const updateCustomNetworkMutation = useMutation({
    mutationFn: (data: UpdateCustomNetworkRequestBody) => updateCustomNetwork(selectedCustomNetwork.id, data),
    onSuccess: async () => {
      onClose();
      snackbar.showSuccess("Customer Network updated successfully");
      refetchCustomNetworks();
    },
  });

  const formData = useFormik({
    initialValues: {
      name: selectedCustomNetwork?.name || "",
      cloudProviderName: selectedCustomNetwork?.cloudProviderName || "aws",
      cloudProviderRegion: selectedCustomNetwork?.cloudProviderRegion || "",
      cidr: selectedCustomNetwork?.cidr || "",
    },
    validationSchema: CustomNetworkValidationSchema,
    onSubmit: (values) => {
      const data = { ...values };
      if (formMode === "create") {
        createCustomNetworkMutation.mutate(data);
      } else {
        updateCustomNetworkMutation.mutate({
          name: data.name,
        });
      }
    },
  });

  const regionMenuItems = useMemo(() => {
    return regions
      .filter((region) => region.cloudProviderName === formData.values.cloudProviderName)
      .map((region) => {
        return {
          value: region.code,
          label: region.code,
        };
      });
  }, [regions, formData.values.cloudProviderName]);

  const cloudProviders = useMemo(() => {
    return (
      regions
        .reduce((acc, region) => {
          if (!acc.includes(region.cloudProviderName)) {
            acc.push(region.cloudProviderName);
          }
          return acc;
        }, [])
        // Sort as ['aws', 'azure', 'gcp']
        .sort((a, b) => a.localeCompare(b))
    );
  }, [regions]);

  const formConfiguration: FormConfiguration = useMemo(() => {
    return {
      title: {
        create: "Create Customer Network",
        modify: "Modify Customer Network",
      },
      description: {
        create: "Create new customer network with the specified details",
        modify: "Update the customer network",
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
          fields: [
            {
              dataTestId: "name-input",
              label: "Name",
              subLabel: "The unique name for the customer network for easy reference",
              name: "name",
              type: "text",
              required: true,
            },
            {
              label: "Cloud Provider",
              subLabel: "Select the cloud provider",
              name: "cloudProviderName",
              required: true,
              customComponent: (
                <CloudProviderRadio
                  cloudProviders={cloudProviders}
                  name="cloudProviderName"
                  formData={formData}
                  onChange={() => {
                    formData.setFieldValue("cloudProviderRegion", "");
                    formData.setFieldTouched("cloudProviderRegion", false);
                  }}
                  disabled={formMode === "modify"}
                />
              ),
              previewValue: formData.values.cloudProviderName
                ? () => {
                    const cloudProvider = formData.values.cloudProviderName;
                    return cloudProviderLongLogoMap[cloudProvider] || "-";
                  }
                : null,
            },
            {
              dataTestId: "region-select",
              label: "Region",
              subLabel: "Choose the cloud provider region",
              name: "cloudProviderRegion",
              type: "select",
              required: true,
              isLoading: isFetchingRegions,
              menuItems: regionMenuItems,
              disabled: formMode === "modify",
            },
            {
              dataTestId: "cidr-input",
              label: "CIDR",
              subLabel: "CIDR block for the network",
              name: "cidr",
              type: "text",
              required: true,
              disabled: formMode === "modify",
            },
          ],
        },
      ],
    };
  }, [cloudProviders, isFetchingRegions, regionMenuItems, formData.values, formMode]);

  return (
    <GridDynamicForm
      formConfiguration={formConfiguration}
      formData={formData}
      formMode={formMode}
      onClose={onClose}
      isFormSubmitting={createCustomNetworkMutation.isPending || updateCustomNetworkMutation.isPending}
      previewCardTitle="Customer Network Summary"
    />
  );
};

export default CustomNetworkForm;
