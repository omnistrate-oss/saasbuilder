"use client";

import { useMemo } from "react";
import { useFormik } from "formik";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { FormConfiguration } from "components/DynamicForm/types";
import GridDynamicForm from "components/DynamicForm/GridDynamicForm";

import { CustomNetworkValidationSchema } from "../constants";

import useSnackbar from "src/hooks/useSnackbar";
import { createCustomNetwork } from "src/api/customNetworks";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import CloudProviderRadio from "app/(dashboard)/components/CloudProviderRadio/CloudProviderRadio";

const CustomNetworkForm = ({
  regions,
  isFetchingRegions,
  refetchCustomNetworks,
  onClose,
}) => {
  const snackbar = useSnackbar();
  const createCustomNetworkMutation: UseMutationResult = useMutation(
    createCustomNetwork,
    {
      onSuccess: async () => {
        onClose();
        snackbar.showSuccess("Custom Network created successfully");
        refetchCustomNetworks();
      },
    }
  );

  const formData = useFormik({
    initialValues: {
      name: "",
      cloudProviderName: "aws",
      cloudProviderRegion: "",
      cidr: "",
    },
    validationSchema: CustomNetworkValidationSchema,
    onSubmit: (values) => {
      const data = { ...values };
      createCustomNetworkMutation.mutate(data);
    },
  });

  const regionMenuItems = useMemo(() => {
    return regions
      .filter(
        (region) =>
          region.cloudProviderName === formData.values.cloudProviderName
      )
      .map((region) => {
        return {
          value: region.code,
          label: region.code,
        };
      });
  }, [regions, formData.values.cloudProviderName]);

  const cloudProviders = useMemo(() => {
    return regions.reduce((acc, region) => {
      if (!acc.includes(region.cloudProviderName)) {
        acc.push(region.cloudProviderName);
      }
      return acc;
    }, []);
  }, [regions]);

  const formConfiguration: FormConfiguration = useMemo(() => {
    return {
      title: {
        create: "Create Custom Network",
      },
      description: {
        create: "Create new custom network with the specified details",
      },
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
              label: "Name",
              subLabel:
                "The unique name for the custom network for easy reference",
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
                />
              ),
              previewValue: ({ field, formData }) => {
                const cloudProvider = formData.values[field.name];
                return cloudProviderLogoMap[cloudProvider] || "-";
              },
            },
            {
              label: "Region",
              subLabel: "Choose the cloud provider region",
              name: "cloudProviderRegion",
              type: "select",
              required: true,
              isLoading: isFetchingRegions,
              menuItems: regionMenuItems,
            },
            {
              label: "CIDR",
              subLabel: "CIDR block for the network",
              name: "cidr",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    };
  }, [
    cloudProviders,
    isFetchingRegions,
    regionMenuItems,
    formData.values.cloudProviderName,
  ]);

  return (
    <GridDynamicForm
      formConfiguration={formConfiguration}
      formData={formData}
      formMode="create"
      onClose={onClose}
      isFormSubmitting={createCustomNetworkMutation.isLoading}
      previewCardTitle="Custom Network Summary"
    />
  );
};

export default CustomNetworkForm;
