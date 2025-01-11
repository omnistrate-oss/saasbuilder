"use client";

import Image from "next/image";
import { Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import useInstances from "./hooks/useInstances";
import InstanceForm from "./components/InstanceForm";
import { getMainResourceFromInstance } from "./utils";
import PageTitle from "../components/Layout/PageTitle";
import InstancesIcon from "../components/Icons/InstancesIcon";
import PageContainer from "../components/Layout/PageContainer";
import InstancesTableHeader from "./components/InstancesTableHeader";
import FullScreenDrawer from "../components/FullScreenDrawer/FullScreenDrawer";

import formatDateUTC from "src/utils/formatDateUTC";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { getInstanceDetailsRoute } from "src/utils/route/routes";
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
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";

import SpeedoMeterLow from "public/assets/images/dashboard/resource-instance-speedo-meter/idle.png";
import SpeedoMeterHigh from "public/assets/images/dashboard/resource-instance-speedo-meter/high.png";
import SpeedoMeterMedium from "public/assets/images/dashboard/resource-instance-speedo-meter/normal.png";

const columnHelper = createColumnHelper<any>(); // TODO: Add type
type Overlay =
  | "create-instance-form"
  | "modify-instance-form"
  | "add-capacity-dialog"
  | "remove-capacity-dialog"
  | "delete-dialog"
  | "restore-dialog"
  | "generate-token-dialog";

const InstancesPage = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "create-instance-form"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const {
    subscriptions,
    serviceOfferingsObj,
    isFetchingSubscriptions,
    isFetchingServiceOfferings,
  } = useGlobalData();

  const subscriptionsObj = useMemo(() => {
    return subscriptions.reduce((acc, subscription) => {
      acc[subscription.id] = subscription;
      return acc;
    }, {});
  }, [subscriptions]);

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        id: "id",
        header: "Instance ID",
        cell: (data) => {
          const {
            id: instanceId,
            subscriptionId,
            detailedNetworkTopology = {},
          } = data.row.original;
          const { serviceId, productTierId } =
            subscriptionsObj[subscriptionId] || {};

          const [mainResourceId] =
            Object.entries(detailedNetworkTopology).find(
              ([, resource]: any) => resource.main
            ) || [];

          const resourceInstanceUrlLink = getInstanceDetailsRoute({
            serviceId,
            servicePlanId: productTierId,
            resourceId: mainResourceId,
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
          const subscription = subscriptionsObj[row.subscriptionId];
          return subscription?.serviceName;
        },
        {
          id: "serviceName",
          header: "Service Name",
          cell: (data) => {
            const subscription =
              subscriptionsObj[data.row.original.subscriptionId];
            const serviceName = subscription?.serviceName;
            const serviceLogoURL = subscription?.serviceLogoURL;

            return (
              <ServiceNameWithLogo
                serviceName={serviceName}
                serviceLogoURL={serviceLogoURL}
              />
            );
          },
        }
      ),
      columnHelper.accessor(
        (row) => getMainResourceFromInstance(row)?.resourceName,
        {
          id: "resourceName",
          header: "Resource Type",
        }
      ),
      columnHelper.accessor(
        (row) => {
          const subscription = subscriptionsObj[row.subscriptionId];
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
          const statusSytlesAndLabel =
            getResourceInstanceStatusStylesAndLabel(status);

          return <StatusChip status={status} {...statusSytlesAndLabel} />;
        },
        meta: {
          minWidth: 170,
        },
      }),
      columnHelper.accessor(
        (row) => {
          const status = row.status;
          const mainResource = getMainResourceFromInstance(row);

          if (CLI_MANAGED_RESOURCES.includes(mainResource?.resourceType)) {
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
          const subscription = subscriptionsObj[row.subscriptionId];
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
  }, [subscriptionsObj]);

  const { data: instances = [] as any[], isFetching: isFetchingInstances } =
    useInstances();

  const selectedInstance = useMemo(() => {
    return instances.find((instance) => instance.id === selectedRows[0]);
  }, [selectedRows, instances]);

  // Subscription of the Selected Instance
  const selectedInstanceSubscription = useMemo(() => {
    return subscriptions.find(
      (subscription) => subscription.id === selectedInstance?.subscriptionId
    );
  }, [selectedInstance, subscriptions]);

  // Offering of the Selected Instance
  const selectedInstanceOffering = useMemo(() => {
    const { serviceId, productTierId } = selectedInstanceSubscription || {};
    return serviceOfferingsObj[serviceId]?.[productTierId];
  }, [selectedInstanceSubscription, serviceOfferingsObj]);

  return (
    <PageContainer>
      <PageTitle icon={InstancesIcon} className="mb-6">
        Deployment Instances
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={instances}
          noRowsText="No instances"
          HeaderComponent={InstancesTableHeader}
          headerProps={{
            selectedInstance,
            setSelectedRows,
            setOverlayType,
            setIsOverlayOpen,
            selectedInstanceOffering,
            selectedInstanceSubscription,
            isFetchingInstances,
          }}
          isLoading={
            isFetchingInstances ||
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
            formMode={
              overlayType === "create-instance-form" ? "create" : "modify"
            }
            onClose={() => setIsOverlayOpen(false)}
            selectedInstance={selectedInstance}
            refetchResourceInstances={() => {}} // TODO
          />
        }
      />

      <TextConfirmationDialog
        open={isOverlayOpen && overlayType === "delete-dialog"}
        handleClose={() => setIsOverlayOpen(false)}
        onConfirm={() => {}}
        title="Delete Instance"
        subtitle={`Are you sure you want to delete - ${selectedRows[0]}?`}
        message="To confirm, please enter <b>deleteme</b>, in the field below:"
        isLoading={false} //TODO: Change This
      />

      <CapacityDialog
        open={
          isOverlayOpen &&
          ["add-capacity-dialog", "remove-capacity-dialog"].includes(
            overlayType
          )
        }
        handleClose={() => setIsOverlayOpen(false)}
        autoscaling={{
          currentReplicas: selectedInstance?.currentReplicas,
          maxReplicas: selectedInstance?.maxReplicas,
          minReplicas: selectedInstance?.minReplicas,
        }}
        // data={capacityData} TODO
        currentCapacityAction={
          overlayType === "add-capacity-dialog" ? "add" : "remove"
        }
        contextType="access"
        // refetch={fetchResourceInstancesOfSelectedResource} TODO
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
    </PageContainer>
  );
};

export default InstancesPage;
