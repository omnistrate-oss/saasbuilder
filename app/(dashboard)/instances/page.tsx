"use client";

import Image from "next/image";
import { Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import InstanceForm from "./components/InstanceForm";
import PageTitle from "../components/Layout/PageTitle";
import InstancesIcon from "../components/Icons/InstancesIcon";
import PageContainer from "../components/Layout/PageContainer";
import InstancesTableHeader from "./components/InstancesTableHeader";

import formatDateUTC from "src/utils/formatDateUTC";
import { useGlobalData } from "src/providers/GlobalDataProvider";

import RegionIcon from "components/Region/RegionIcon";
import AwsLogo from "components/Logos/AwsLogo/AwsLogo";
import GcpLogo from "components/Logos/GcpLogo/GcpLogo";
import DataTable from "components/DataTable/DataTable";
import AzureLogo from "components/Logos/AzureLogo/AzureLogo";
import GridCellExpand from "components/GridCellExpand/GridCellExpand";
import CapacityDialog from "components/CapacityDialog/CapacityDialog";
import SideDrawerRight from "components/SideDrawerRight/SideDrawerRight";
import GenerateTokenDialog from "components/GenerateToken/GenerateTokenDialog";
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

const instances = [];

const InstancesPage = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [overlayType, setOverlayType] = useState<Overlay>(
    "create-instance-form"
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const { subscriptions, serviceOfferingsObj } = useGlobalData();

  const dataTableColumns = useMemo(() => {
    return [
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
        meta: {
          minWidth: 150,
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
        meta: {
          minWidth: 150,
        },
      }),
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
  }, []);

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
          }}
          isLoading={false}
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
          selectionMode="single"
        />
      </div>

      <SideDrawerRight
        size="xlarge"
        open={
          isOverlayOpen &&
          ["create-instance-form", "modify-instance-form"].includes(overlayType)
        }
        closeDrawer={() => setIsOverlayOpen(false)}
        RenderUI={<InstanceForm />}
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
