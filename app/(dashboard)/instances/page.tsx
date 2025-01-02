"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Stack } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";

import PageTitle from "../components/Layout/PageTitle";
import InstancesIcon from "../components/Icons/InstancesIcon";
import PageContainer from "../components/Layout/PageContainer";
import InstancesTableHeader from "./components/InstancesTableHeader";

import formatDateUTC from "src/utils/formatDateUTC";
import DataTable from "src/components/DataTable/DataTable";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";

import AwsLogo from "components/Logos/AwsLogo/AwsLogo";
import GcpLogo from "components/Logos/GcpLogo/GcpLogo";
import RegionIcon from "src/components/Region/RegionIcon";
import AzureLogo from "components/Logos/AzureLogo/AzureLogo";
import SpeedoMeterLow from "public/assets/images/dashboard/resource-instance-speedo-meter/idle.png";
import SpeedoMeterHigh from "public/assets/images/dashboard/resource-instance-speedo-meter/high.png";
import SpeedoMeterMedium from "public/assets/images/dashboard/resource-instance-speedo-meter/normal.png";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

const InstancesPage = () => {
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

  return (
    <PageContainer>
      <PageTitle icon={InstancesIcon} className="mb-6">
        Deployment Instances
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={[]}
          noRowsText="No instances"
          HeaderComponent={InstancesTableHeader}
          headerProps={{}}
          isLoading={false}
        />
      </div>
    </PageContainer>
  );
};

export default InstancesPage;
