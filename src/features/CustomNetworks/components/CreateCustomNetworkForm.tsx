import { FC, useMemo } from "react";
import { useFormik } from "formik";
import {
  QueryObserverResult,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import useSnackbar from "src/hooks/useSnackbar";
import DynamicForm from "src/components/DynamicForm/DynamicForm";
import {
  createCustomNetwork,
  modifyCustomNetwork,
} from "src/api/customNetworks";
import { customNetworkValidationSchema } from "../constants";
import { CustomNetwork } from "src/types/customNetwork";
import { CloudProvider, FormMode } from "src/types/common/enums";
import { cloudProviderLabels } from "src/utils/constants/cloudProviders";

type CustomNetworkFormProps = {
  selectedCustomNetwork: CustomNetwork | null;
  closeDrawer: () => void;
  refetchCustomNetworks: () => Promise<
    QueryObserverResult<CustomNetwork[], unknown>
  >;
  onDelete: () => void;
  cloudProviders: CloudProvider[];
  cloudProviderRegions: any[];
  //array of supported aws, gcp region codes
  supportedAWSRegions: string[];
  supportedGCPRegions: string[];
};

const CustomNetworkForm: FC<CustomNetworkFormProps> = ({
  selectedCustomNetwork,
  closeDrawer,
  onDelete,
  refetchCustomNetworks,
  cloudProviders,
  cloudProviderRegions,
  supportedAWSRegions,
  supportedGCPRegions,
}) => {
  const snackbar = useSnackbar();
  const formMode: FormMode = selectedCustomNetwork ? "edit" : "create";

  const createCustomNetworkMutation: UseMutationResult = useMutation(
    createCustomNetwork,
    {
      onSuccess: async () => {
        closeDrawer();
        snackbar.showSuccess("Created Custom Network successfully");
        refetchCustomNetworks();
      },
    }
  );

  const modifyCustomNetworkMutation: UseMutationResult = useMutation(
    modifyCustomNetwork,
    {
      onSuccess: async () => {
        closeDrawer();
        snackbar.showSuccess("Update Custom Network successfully");
        refetchCustomNetworks();
      },
    }
  );

  let defaultProvider = "aws";
  if (!cloudProviders.includes("aws")) {
    defaultProvider = "gcp";
  }

  const formData = useFormik({
    initialValues: {
      name: selectedCustomNetwork?.name ?? "",
      cloudProviderName:
        selectedCustomNetwork?.cloudProviderName ?? defaultProvider,
      cloudProviderRegion: selectedCustomNetwork?.cloudProviderRegion ?? "",
      cidr: selectedCustomNetwork?.cidr ?? "",
    },
    validationSchema: customNetworkValidationSchema,
    onSubmit: (values) => {
      const data = { ...values };

      if (formMode === "create") {
        createCustomNetworkMutation.mutate(data);
      }
      if (formMode === "edit") {
        const nameOnlyPyload = {
          name: values?.name,
          id: selectedCustomNetwork?.id,
        };
        modifyCustomNetworkMutation.mutate(nameOnlyPyload);
      }
    },
  });

  const cloudProviderRegionOptions = useMemo(() => {
    let regions = cloudProviderRegions || [];
    const selectedCloudProvider = formData.values.cloudProviderName;

    if (selectedCloudProvider) {
      regions = regions.filter((region) => {
        return region.cloudProviderName === selectedCloudProvider;
      });

      if (selectedCloudProvider === "aws") {
        regions = regions.filter((region) =>
          supportedAWSRegions.includes(region.code)
        );
      }

      if (selectedCloudProvider === "gcp") {
        regions = regions.filter((region) =>
          supportedGCPRegions.includes(region.code)
        );
      }
    }

    return regions
      .map((region) => ({
        label: `${region.code} - ${region.description}`,
        value: region.code,
      }))
      .sort((a, b) => {
        return a.label < b.label ? -1 : 1;
      });
  }, [
    cloudProviderRegions,
    formData.values.cloudProviderName,
    supportedAWSRegions,
    supportedGCPRegions,
  ]);

  const cloudProviderOptions = useMemo(() => {
    const providers =
      cloudProviders.map((provider) => ({
        label: cloudProviderLabels[provider],
        value: provider,
      })) || [];

    return providers;
  }, [cloudProviders]);

  const formConfiguration = useMemo(
    () => ({
      title: {
        create: "Create Custom Network",
        edit: "Modify Custom Network",
      },
      description: {
        create: "Create a new custom network with the specified details",
        edit: "Update the existing custom network details",
      },
      footer: {
        submitButton: {
          create: "Create Custom Network",
          edit: "Save",
        },
      },

      accordions: [
        {
          title: "Standard Information",
          description: "Provide the basic information for the custom networks",

          fields: [
            {
              label: "Name",
              name: "name",
              type: "text",
              required: true,
              description:
                "The unique name for the custom network for easy reference",
            },
            {
              label: "Cloud Provider",
              name: "cloudProviderName",
              type: "select",
              required: true,
              description:
                "Choose the cloud provider on which the instance will run",
              disabled: formMode === "edit",
              menuItems: cloudProviderOptions,
              onChange: () => {
                formData.setFieldValue("cloudProviderRegion", "");
              },
            },
            {
              label: "Region",
              name: "cloudProviderRegion",
              type: "select",
              required: true,
              description: "Choose the cloud provider region",
              disabled: formMode === "edit",
              menuItems: cloudProviderRegionOptions,
            },
            {
              label: "CIDR",
              name: "cidr",
              type: "text",
              required: true,
              description: "CIDR block for the network",
              disabled: formMode === "edit",
            },
          ],
        },
      ],
    }),
    [formMode, cloudProviderOptions, cloudProviderRegionOptions]
  );
  return (
    <>
      <DynamicForm
        formConfiguration={formConfiguration}
        formData={formData}
        formMode={formMode}
        onClose={closeDrawer}
        isFormSubmitting={
          createCustomNetworkMutation.isLoading ||
          modifyCustomNetworkMutation.isLoading
        }
        onDelete={onDelete}
      />
    </>
  );
};

export default CustomNetworkForm;
