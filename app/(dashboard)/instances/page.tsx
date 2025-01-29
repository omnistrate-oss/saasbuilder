"use client";

import Image from "next/image";
import { Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import useInstances from "./hooks/useInstances";
import InstanceForm from "./components/InstanceForm";
import { getMainResourceFromInstance } from "./utils";
import PageTitle from "../components/Layout/PageTitle";
import InstancesIcon from "../components/Icons/InstancesIcon";
import PageContainer from "../components/Layout/PageContainer";
import InstancesTableHeader from "./components/InstancesTableHeader";
import FullScreenDrawer from "../components/FullScreenDrawer/FullScreenDrawer";

import useSnackbar from "src/hooks/useSnackbar";
import formatDateUTC from "src/utils/formatDateUTC";
import { ResourceInstance } from "src/types/resourceInstance";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { getInstanceDetailsRoute } from "src/utils/route/routes";
import { deleteResourceInstance } from "src/api/resourceInstance";
import { calculateInstanceHealthPercentage } from "src/utils/instanceHealthPercentage";
import { getResourceInstanceStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceStatus";

import RegionIcon from "components/Region/RegionIcon";
import AwsLogo from "components/Logos/AwsLogo/AwsLogo";
import GcpLogo from "components/Logos/GcpLogo/GcpLogo";
import DataTable from "components/DataTable/DataTable";
import StatusChip from "components/StatusChip/StatusChip";
import DataGridText from "components/DataGrid/DataGridText";
import AzureLogo from "components/Logos/AzureLogo/AzureLogo";
import GridCellExpand from "components/GridCellExpand/GridCellExpand";
import CapacityDialog from "components/CapacityDialog/CapacityDialog";
import GenerateTokenDialog from "components/GenerateToken/GenerateTokenDialog";
import GradientProgressBar from "components/GradientProgessBar/GradientProgressBar";
import ServiceNameWithLogo from "components/ServiceNameWithLogo/ServiceNameWithLogo";
import AccessSideRestoreInstance from "components/RestoreInstance/AccessSideRestoreInstance";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";
import CreateInstanceModal from "components/ResourceInstance/CreateInstanceModal/CreateInstanceModal";

import SpeedoMeterLow from "public/assets/images/dashboard/resource-instance-speedo-meter/idle.png";
import SpeedoMeterHigh from "public/assets/images/dashboard/resource-instance-speedo-meter/high.png";
import SpeedoMeterMedium from "public/assets/images/dashboard/resource-instance-speedo-meter/normal.png";

const columnHelper = createColumnHelper<ResourceInstance>();
type Overlay =
  | "create-instance-form"
  | "modify-instance-form"
  | "add-capacity-dialog"
  | "remove-capacity-dialog"
  | "delete-dialog"
  | "restore-dialog"
  | "generate-token-dialog"
  | "create-instance-dialog";

const InstancesPage = () => {
  const snackbar = useSnackbar();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "create-instance-form"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [createInstanceModalData, setCreateInstanceModalData] = useState<{
    instanceId?: string;
    isCustomDNS?: boolean;
  }>({});
  const {
    subscriptionsObj,
    serviceOfferingsObj,
    isFetchingSubscriptions,
    isFetchingServiceOfferings,
  } = useGlobalData();

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        id: "id",
        header: "Deployment ID",
        cell: (data) => {
          const {
            id: instanceId,
            subscriptionId,
            resourceID,
          } = data.row.original;
          const { serviceId, productTierId } =
            subscriptionsObj[subscriptionId as string] || {};

          const resourceInstanceUrlLink = getInstanceDetailsRoute({
            serviceId,
            servicePlanId: productTierId,
            resourceId: resourceID,
            instanceId,
            subscriptionId,
          });

          return (
            <DataGridText
              color="primary"
              showCopyButton
              linkProps={{
                href: resourceInstanceUrlLink,
              }}
              style={{
                fontWeight: 600,
              }}
            >
              {instanceId}
            </DataGridText>
          );
        },
        meta: {
          minWidth: 250,
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
            const subscription =
              subscriptionsObj[data.row.original.subscriptionId as string];
            const serviceName = subscription?.serviceName;
            const serviceLogoURL = subscription?.serviceLogoURL;

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
          const offering =
            serviceOfferingsObj[subscription?.serviceId as string]?.[
              subscription?.productTierId as string
            ];

          const mainResource = getMainResourceFromInstance(row, offering);
          return mainResource?.name || "-";
        },
        {
          id: "resourceName",
          header: "Resource Type",
        }
      ),
      columnHelper.accessor(
        (row) => {
          const subscription = subscriptionsObj[row.subscriptionId as string];
          return subscription?.productTierName;
        },
        {
          id: "subscriptionPlan",
          header: "Subscription Plan",
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

          return <StatusChip status={status} {...statusSytlesAndLabel} />;
        },
        meta: {
          minWidth: 170,
        },
      }),
      columnHelper.accessor(
        (row) => {
          const status = row.status;
          const subscription = subscriptionsObj[row.subscriptionId as string];
          const offering =
            serviceOfferingsObj[subscription?.serviceId as string]?.[
              subscription?.productTierId as string
            ];
          const mainResource = getMainResourceFromInstance(row, offering);

          if (
            CLI_MANAGED_RESOURCES.includes(mainResource?.resourceType as string)
          ) {
            return "Unknown";
          }

          if (status === "STOPPED") {
            return "N/A";
          }

          const healthPercentage = calculateInstanceHealthPercentage(
            row.detailedNetworkTopology,
            status
          );

          return healthPercentage;
        },
        {
          id: "healthStatus",
          header: "Health Status",
          cell: (data) => {
            const value = data.cell.getValue();

            if (value === "Unknown")
              return <StatusChip category="unknown" label="Unknown" />;

            if (value === "N/A")
              return <StatusChip category="unknown" label="N/A" />;

            return <GradientProgressBar percentage={value} />;
          },
          meta: {
            minWidth: 200,
          },
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
      columnHelper.accessor("cloud_provider", {
        id: "cloud_provider",
        header: "Provider",
        cell: (data) => {
          const cloudProvider = data.row.original.cloud_provider;

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
      }),
      columnHelper.accessor("instanceLoadStatus", {
        id: "instanceLoadStatus",
        header: "Load",
        cell: (data) => {
          const instanceLoadStatus = data.row.original.instanceLoadStatus;

          return (
            <Stack direction="row" alignItems="center" gap="4px">
              {instanceLoadStatus === "UNKNOWN" && "-"}
              {instanceLoadStatus === "POD_IDLE" && (
                <Image
                  src={SpeedoMeterLow}
                  width={54}
                  height={54}
                  alt="Low"
                  style={{ marginBottom: "-25px" }}
                />
              )}
              {instanceLoadStatus === "POD_NORMAL" && (
                <Image
                  src={SpeedoMeterMedium}
                  width={54}
                  height={54}
                  alt="Medium"
                  style={{ marginBottom: "-25px" }}
                />
              )}
              {instanceLoadStatus === "POD_OVERLOAD" && (
                <Image
                  src={SpeedoMeterHigh}
                  width={54}
                  height={54}
                  alt="High"
                  style={{ marginBottom: "-25px" }}
                />
              )}
            </Stack>
          );
        },
        meta: {
          minWidth: 120,
        },
      }),
      columnHelper.accessor("region", {
        id: "region",
        header: "Region",
        cell: (data) => {
          return (
            <GridCellExpand
              value={data.row.original.region || "Global"}
              startIcon={<RegionIcon />}
            />
          );
        },
      }),
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
      columnHelper.accessor((row) => formatDateUTC(row.last_modified_at), {
        id: "last_modified_at",
        header: "Last Modified",
        cell: (data) => {
          return data.row.original.last_modified_at
            ? formatDateUTC(data.row.original.last_modified_at)
            : "-";
        },
        meta: {
          minWidth: 225,
        },
      }),
    ];
  }, [subscriptionsObj, serviceOfferingsObj]);

  const {
    data: instances = [],
    isLoading: isLoadingInstances,
    isFetching: isFetchingInstances,
    refetch: refetchInstances,
  } = useInstances();

  // Filter BYOA Account Instances
  const nonBYOAInstances = useMemo(() => {
    return instances.filter(
      // @ts-ignore
      (instance) => !instance.result_params?.account_configuration_method
    );
  }, [instances]);

  const selectedInstance = useMemo(() => {
    return nonBYOAInstances.find((instance) => instance.id === selectedRows[0]);
  }, [selectedRows, nonBYOAInstances]);

  // Subscription of the Selected Instance
  const selectedInstanceSubscription = useMemo(() => {
    return subscriptionsObj[selectedInstance?.subscriptionId as string];
  }, [selectedInstance, subscriptionsObj]);

  // Offering of the Selected Instance
  const selectedInstanceOffering = useMemo(() => {
    const { serviceId, productTierId } = selectedInstanceSubscription || {};
    return serviceOfferingsObj[serviceId]?.[productTierId];
  }, [selectedInstanceSubscription, serviceOfferingsObj]);

  // Resource of the Selected Instance
  const selectedResource = useMemo(() => {
    return getMainResourceFromInstance(
      selectedInstance,
      selectedInstanceOffering
    );
  }, [selectedInstance, selectedInstanceOffering]);

  const selectedInstanceData = useMemo(() => {
    return {
      id: selectedInstance?.id,
      instanceId: selectedInstance?.id as string,
      serviceProviderId: selectedInstanceOffering?.serviceProviderId,
      serviceKey: selectedInstanceOffering?.serviceURLKey,
      serviceAPIVersion: selectedInstanceOffering?.serviceAPIVersion,
      serviceEnvironmentKey: selectedInstanceOffering?.serviceEnvironmentURLKey,
      serviceModelKey: selectedInstanceOffering?.serviceModelURLKey,
      productTierKey: selectedInstanceOffering?.productTierURLKey,
      resourceKey: selectedResource?.urlKey as string,
      subscriptionId: selectedInstanceSubscription?.id,
    };
  }, [
    selectedInstance,
    selectedInstanceOffering,
    selectedInstanceSubscription,
    selectedResource,
  ]);

  const deleteInstanceMutation = useMutation(
    () => {
      return deleteResourceInstance(selectedInstanceData);
    },
    {
      onSuccess: () => {
        setSelectedRows([]);
        refetchInstances();
        setIsOverlayOpen(false);
        snackbar.showSuccess("Deleting resource instance...");
      },
    }
  );

  return (
    <PageContainer>
      <PageTitle icon={InstancesIcon} className="mb-6">
        Deployment Instances
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={nonBYOAInstances}
          noRowsText="No instances"
          HeaderComponent={InstancesTableHeader}
          headerProps={{
            count: nonBYOAInstances.length,
            selectedInstance,
            setSelectedRows,
            setOverlayType,
            setIsOverlayOpen,
            selectedInstanceOffering,
            selectedInstanceSubscription,
            refetchInstances,
            isFetchingInstances,
          }}
          isLoading={
            isLoadingInstances ||
            isFetchingSubscriptions ||
            isFetchingServiceOfferings
          }
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
          selectionMode="single"
        />
      </div>

      <FullScreenDrawer
        title={
          overlayType === "create-instance-form"
            ? "Create Deployment Instance"
            : "Modify Deployment Instance"
        }
        description={
          overlayType === "create-instance-form"
            ? "Create new Deployment Instance"
            : "Modify Deployment Instance"
        }
        open={
          isOverlayOpen &&
          ["create-instance-form", "modify-instance-form"].includes(overlayType)
        }
        closeDrawer={() => setIsOverlayOpen(false)}
        RenderUI={
          <InstanceForm
            instances={instances}
            formMode={
              overlayType === "create-instance-form" ? "create" : "modify"
            }
            selectedInstance={selectedInstance}
            refetchInstances={refetchInstances}
            setCreateInstanceModalData={setCreateInstanceModalData}
            setIsOverlayOpen={setIsOverlayOpen}
            setOverlayType={setOverlayType}
          />
        }
      />

      <TextConfirmationDialog
        open={isOverlayOpen && overlayType === "delete-dialog"}
        handleClose={() => setIsOverlayOpen(false)}
        onConfirm={async () => {
          if (!selectedInstance)
            return snackbar.showError("No instance selected");
          if (!selectedInstanceOffering || !selectedInstanceSubscription) {
            return snackbar.showError("Subscription not found");
          }
          if (!selectedResource) {
            return snackbar.showError("Resource not found");
          }
          await deleteInstanceMutation.mutateAsync();
        }}
        title="Delete Instance"
        subtitle={`Are you sure you want to delete - ${selectedRows[0]}?`}
        message="To confirm, please enter <b>deleteme</b>, in the field below:"
        isLoading={deleteInstanceMutation.isLoading}
      />

      <CapacityDialog
        open={
          isOverlayOpen &&
          ["add-capacity-dialog", "remove-capacity-dialog"].includes(
            overlayType
          )
        }
        currentCapacityAction={
          overlayType === "add-capacity-dialog" ? "add" : "remove"
        }
        contextType="access"
        handleClose={() => setIsOverlayOpen(false)}
        autoscaling={{
          currentReplicas: selectedInstance?.currentReplicas,
          maxReplicas: selectedInstance?.maxReplicas,
          minReplicas: selectedInstance?.minReplicas,
        }}
        data={selectedInstanceData}
        refetch={refetchInstances}
      />

      <GenerateTokenDialog
        dashboardEndpoint={
          selectedInstance?.kubernetesDashboardEndpoint?.dashboardEndpoint
        }
        open={isOverlayOpen && overlayType === "generate-token-dialog"}
        onClose={() => setIsOverlayOpen(false)}
        selectedInstanceId={selectedInstance?.id}
        subscriptionId={selectedInstance?.subscriptionId}
      />

      <AccessSideRestoreInstance
        open={isOverlayOpen && overlayType === "restore-dialog"}
        handleClose={() => setIsOverlayOpen(false)}
        earliestRestoreTime={
          selectedInstance?.backupStatus?.earliestRestoreTime
        }
        service={selectedInstanceOffering}
        setSelectionModel={setSelectedRows}
        fetchResourceInstances={refetchInstances}
        selectedResource={selectedResource}
        subscriptionId={selectedInstanceSubscription?.id}
        selectedInstanceId={selectedInstance?.id}
        networkType={selectedInstance?.network_type}
      />

      <CreateInstanceModal
        open={isOverlayOpen && overlayType === "create-instance-dialog"}
        handleClose={() => setIsOverlayOpen(false)}
        data={createInstanceModalData}
      />
    </PageContainer>
  );
};

export default InstancesPage;
