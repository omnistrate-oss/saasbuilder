"use client";

import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import Tooltip from "components/Tooltip/Tooltip";
import DataTable from "components/DataTable/DataTable";
import AwsLogo from "components/Logos/AwsLogo/AwsLogo";
import GcpLogo from "components/Logos/GcpLogo/GcpLogo";
import StatusChip from "components/StatusChip/StatusChip";
import DataGridText from "components/DataGrid/DataGridText";
import AzureLogo from "components/Logos/AzureLogo/AzureLogo";
import ViewInstructionsIcon from "components/Icons/AccountConfig/ViewInstrcutionsIcon";

import PageTitle from "../components/Layout/PageTitle";
import useInstances from "../instances/hooks/useInstances";
import CloudAccountForm from "./components/CloudAccountForm";
import PageContainer from "../components/Layout/PageContainer";
import CloudAccountsIcon from "../components/Icons/CloudAccountsIcon";
import CloudAccountsTableHeader from "./components/CloudAccountsTableHeader";
import FullScreenDrawer from "../components/FullScreenDrawer/FullScreenDrawer";

import useSnackbar from "src/hooks/useSnackbar";
import formatDateUTC from "src/utils/formatDateUTC";
import { ResourceInstance } from "src/types/resourceInstance";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import {
  deleteResourceInstance,
  getTerraformKit,
} from "src/api/resourceInstance";
import { getResourceInstanceStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceStatus";
import DeleteAccountConfigConfirmationDialog from "src/components/DeleteAccountConfigConfirmationDialog/DeleteAccountConfigConfirmationDialog";
import CloudProviderAccountOrgIdModal from "src/components/CloudProviderAccountOrgIdModal/CloudProviderAccountOrgIdModal";
import ServiceNameWithLogo from "src/components/ServiceNameWithLogo/ServiceNameWithLogo";

const columnHelper = createColumnHelper<ResourceInstance>();

type Overlay =
  | "delete-dialog"
  | "create-instance-form"
  | "view-instance-form"
  | "view-instructions-dialog";

const CloudAccountsPage = () => {
  const snackbar = useSnackbar();
  const { subscriptionsObj, serviceOfferingsObj } = useGlobalData();
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "create-instance-form"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isAccountCreation, setIsAccountCreation] = useState(false);
  const [clickedInstance, setClickedInstance] = useState<ResourceInstance>();

  const {
    data: instances = [],
    isLoading: isLoadingInstances,
    isFetching: isFetchingInstances,
    refetch: refetchInstances,
  } = useInstances();

  const byoaInstances = useMemo(
    () =>
      instances.filter(
        // @ts-ignore
        (instance) => instance.result_params?.account_configuration_method
      ),
    [instances]
  );

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor(
        (row) =>
          // @ts-ignore
          row.result_params?.gcp_project_id ||
          // @ts-ignore
          row.result_params?.aws_account_id ||
          "-",
        {
          id: "account_id",
          header: "Account ID / Project ID",
          cell: (data) => {
            const value =
              // @ts-ignore
              data.row.original.result_params?.gcp_project_id ||
              // @ts-ignore
              data.row.original.result_params?.aws_account_id ||
              "-";

            return (
              <DataGridText
                showCopyButton={value !== "-"}
                color="primary"
                onClick={() => {
                  setClickedInstance(data.row.original);
                  setIsOverlayOpen(true);
                  setOverlayType("view-instructions-dialog");
                }}
              >
                {value}
              </DataGridText>
            );
          },
        }
      ),
      columnHelper.accessor("status", {
        id: "status",
        header: "Lifecycle Status",
        cell: (data) => {
          const status = data.row.original.status;
          const statusSytlesAndLabel = getResourceInstanceStatusStylesAndLabel(
            status as string
          );
          const showInstructions = [
            "VERIFYING",
            "PENDING",
            "PENDING_DEPENDENCY",
            "UNKNOWN",
            "DEPLOYING",
            "READY",
            "FAILED",
          ].includes(status as string);

          return (
            <Stack
              direction="row"
              alignItems="center"
              gap="6px"
              width="94px"
              justifyContent="space-between"
            >
              <StatusChip status={status} {...statusSytlesAndLabel} />
              {showInstructions && (
                <Tooltip
                  title="View account configuration instructions"
                  placement="top"
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setClickedInstance(data.row.original);
                      setIsOverlayOpen(true);
                      setOverlayType("view-instructions-dialog");
                    }}
                  >
                    <ViewInstructionsIcon />
                  </Box>
                </Tooltip>
              )}
            </Stack>
          );
        },
        meta: {
          minWidth: 170,
        },
      }),
      columnHelper.accessor(
        (row) => {
          const subscription = subscriptionsObj[row.subscriptionId as string];
          return subscription?.serviceName;
        },
        {
          id: "serviceName",
          header: "Service Name",
          cell: (data) => {
            const { serviceLogoURL, serviceName } =
              subscriptionsObj[data.row.original.subscriptionId as string] ||
              {};
            return (
              <ServiceNameWithLogo
                serviceName={serviceName}
                serviceLogoURL={serviceLogoURL}
              />
            );
          },
          meta: {
            minWidth: 230,
          },
        }
      ),
      columnHelper.accessor(
        (row) => {
          const subscription = subscriptionsObj[row.subscriptionId as string];
          return subscription?.productTierName || "-";
        },
        {
          id: "servicePlanName",
          header: "Subscription Plan",
        }
      ),

      columnHelper.accessor(
        // @ts-ignore
        (row) => row.cloud_provider || row.result_params?.cloud_provider || "-",
        {
          id: "cloud_provider",
          header: "Provider",
          cell: (data) => {
            const cloudProvider =
              // @ts-ignore
              data.row.original.result_params?.gcp_project_id ? "gcp" : "aws";

            return cloudProvider === "aws" ? (
              <AwsLogo />
            ) : cloudProvider === "gcp" ? (
              <GcpLogo />
            ) : cloudProvider === "azure" ? (
              <AzureLogo />
            ) : (
              "-"
            );
          },
        }
      ),
      columnHelper.accessor(
        (row) => {
          const subscription = subscriptionsObj[row.subscriptionId as string];
          return subscription?.subscriptionOwnerName;
        },
        {
          id: "subscriptionOwner",
          header: "Subscription Owner",
        }
      ),
      columnHelper.accessor((row) => formatDateUTC(row.created_at), {
        id: "created_at",
        header: "Created On",
        cell: (data) => {
          return data.row.original.created_at
            ? formatDateUTC(data.row.original.created_at)
            : "-";
        },
        meta: {
          minWidth: 225,
        },
      }),
    ];
  }, []);

  const selectedInstance = useMemo(() => {
    return instances.find((instance) => instance.id === selectedRows[0]);
  }, [selectedRows, instances]);

  // Subscription of the Selected Instance
  const selectedInstanceSubscription = useMemo(() => {
    return subscriptionsObj[selectedInstance?.subscriptionId as string];
  }, [selectedInstance, subscriptionsObj]);

  // Offering of the Selected Instance
  const selectedInstanceOffering = useMemo(() => {
    const { serviceId, productTierId } = selectedInstanceSubscription || {};
    return serviceOfferingsObj[serviceId]?.[productTierId];
  }, [selectedInstanceSubscription, serviceOfferingsObj]);

  // Resource
  const selectedResource = useMemo(() => {
    return selectedInstanceOffering?.resourceParameters?.find((resource) =>
      resource.resourceId.startsWith("r-injectedaccountconfig")
    );
  }, [selectedInstanceOffering?.resourceParameters]);

  const deleteAccountConfigMutation = useMutation(
    () => {
      const requestPayload = {
        serviceProviderId: selectedInstanceOffering?.serviceProviderId,
        serviceKey: selectedInstanceOffering?.serviceURLKey,
        serviceAPIVersion: selectedInstanceOffering?.serviceAPIVersion,
        serviceEnvironmentKey:
          selectedInstanceOffering?.serviceEnvironmentURLKey,
        serviceModelKey: selectedInstanceOffering?.serviceModelURLKey,
        productTierKey: selectedInstanceOffering?.productTierURLKey,
        resourceKey: selectedResource?.urlKey,
        id: selectedInstance?.id,
        subscriptionId: selectedInstance?.subscriptionId,
      };
      return deleteResourceInstance(requestPayload);
    },
    {
      onSuccess: () => {
        setSelectedRows([]);
        refetchInstances();
        setIsOverlayOpen(false);
        snackbar.showSuccess("Deleting account config...");

        // eslint-disable-next-line no-use-before-define
        deleteformik.resetForm();
      },
    }
  );

  const deleteformik = useFormik({
    initialValues: {
      deleteme: "",
    },
    onSubmit: (values) => {
      if (!selectedInstance) return snackbar.showError("No instance selected");
      if (!selectedResource) return snackbar.showError("Resource not found");

      if (values.deleteme === "deleteme") {
        deleteAccountConfigMutation.mutate();
      } else {
        snackbar.showError("Please enter deleteme");
      }
    },
    validateOnChange: false,
  });

  const downloadTerraformKitMutation = useMutation(
    () => {
      if (selectedInstanceOffering && selectedInstanceSubscription) {
        return getTerraformKit(
          selectedInstanceOffering.serviceProviderId,
          selectedInstanceOffering.serviceURLKey,
          selectedInstanceOffering.serviceAPIVersion,
          selectedInstanceOffering.serviceEnvironmentURLKey,
          selectedInstanceOffering.serviceModelURLKey,
          selectedInstanceSubscription.id,
          // @ts-ignore
          clickedInstance?.result_params?.gcp_project_id ? "gcp" : "aws"
        );
      }
    },
    {
      onSuccess: (response: any) => {
        if (!response?.data) {
          return snackbar.showError("Failed to download terraform kit");
        }
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "terraformkit.tar");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      },
    }
  );

  useEffect(() => {
    if (isAccountCreation) {
      setIsOverlayOpen(true);
      setOverlayType("view-instructions-dialog");
    }
  }, [isAccountCreation]);

  console.log(clickedInstance);

  return (
    <PageContainer>
      <PageTitle icon={CloudAccountsIcon} className="mb-6">
        Cloud Accounts
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={byoaInstances}
          noRowsText="No cloud accounts"
          HeaderComponent={CloudAccountsTableHeader}
          headerProps={{
            count: byoaInstances.length,
            searchText,
            setSearchText,
            onCreateClick: () => {
              setIsOverlayOpen(true);
              setOverlayType("create-instance-form");
            },
            onDeleteClick: () => {
              setIsOverlayOpen(true);
              setOverlayType("delete-dialog");
            },
            selectedInstance,
            refetchInstances: refetchInstances,
            isFetchingInstances: isFetchingInstances,
          }}
          isLoading={isLoadingInstances}
          selectionMode="single"
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
        />
      </div>

      <FullScreenDrawer
        title="Cloud Account"
        description="Create a new cloud account"
        open={
          isOverlayOpen &&
          (overlayType === "create-instance-form" ||
            overlayType === "view-instance-form")
        }
        closeDrawer={() => {
          setIsOverlayOpen(false);
          setClickedInstance(undefined);
        }}
        RenderUI={
          <CloudAccountForm
            selectedInstance={selectedInstance}
            onClose={() => {
              setIsOverlayOpen(false);
            }}
            formMode={overlayType === "view-instance-form" ? "view" : "create"}
            refetchInstances={refetchInstances}
            setIsAccountCreation={setIsAccountCreation}
            setOverlayType={setOverlayType}
            setClickedInstance={setClickedInstance}
          />
        }
      />

      <DeleteAccountConfigConfirmationDialog
        open={isOverlayOpen && overlayType === "delete-dialog"}
        handleClose={() => {
          setIsOverlayOpen(false);
          deleteformik.resetForm();
        }}
        formData={deleteformik}
        title="Delete Account Config"
        isLoading={deleteAccountConfigMutation.isLoading}
      />

      <CloudProviderAccountOrgIdModal
        isAccessPage
        open={isOverlayOpen && overlayType === "view-instructions-dialog"}
        handleClose={() => {
          setIsOverlayOpen(false);
          setTimeout(() => {
            setClickedInstance(undefined);
            setIsAccountCreation(false);
          }, 1000);
        }}
        orgId={
          subscriptionsObj[clickedInstance?.subscriptionId as string]
            ?.accountConfigIdentityId
        }
        downloadTerraformKitMutation={downloadTerraformKitMutation}
        accountConfigId={clickedInstance?.id}
        selectedAccountConfig={clickedInstance}
        accountConfigMethod={
          // @ts-ignore
          clickedInstance?.result_params?.account_configuration_method
        }
        cloudFormationTemplateUrl={
          selectedInstanceOffering?.assets?.cloudFormationURL
        }
        cloudFormationTemplateUrlNoLB={
          selectedInstanceOffering?.assets?.cloudFormationURLNoLB
        }
        isAccountCreation={isAccountCreation}
      />
    </PageContainer>
  );
};

export default CloudAccountsPage;
