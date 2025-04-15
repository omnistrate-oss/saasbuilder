import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "src/components/DataTable/DataTable";
import { FC, useMemo } from "react";
import { Text } from "src/components/Typography/Typography";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ServiceNameWithLogo from "src/components/ServiceNameWithLogo/ServiceNameWithLogo";

dayjs.extend(utc);

export type SubscriptionUsageRow = {
  subcriptionId: string;
  serviceId: string;
  serviceName: string;
  subscriptionPlanName: string;
  storageGiBHours: number;
  memoryGiBHours: number;
  cpuCoreHours: number;
  serviceLogoURL?: string;
};

const columnHelper = createColumnHelper<SubscriptionUsageRow>();

type SubscriptionUsageTableProps = {
  rows: SubscriptionUsageRow[];
  isLoadingSubscriptionsUsage: boolean;
};

const SubscriptionUsageTable: FC<SubscriptionUsageTableProps> = ({
  rows,
  isLoadingSubscriptionsUsage,
}) => {
  const columns = useMemo(() => {
    return [
      //@ts-ignore
      columnHelper.accessor("serviceName", {
        id: "serviceName",
        header: "Service Name",
        meta: {
          minWidth: 320,
        },
        cell: (data) => {
          //@ts-ignore
          const { serviceName, serviceLogoURL } = data.row.original;

          return (
            <ServiceNameWithLogo
              serviceName={serviceName}
              serviceLogoURL={serviceLogoURL}
              textStyles={{
                color: "#535862",
                cursor: "auto",
              }}
            />
          );
        },
      }),
      columnHelper.accessor("subscriptionPlanName", {
        id: "subscriptionPlanName",
        header: "Subscription Plan",
        meta: {
          minWidth: 240,
        },
        cell: (data) => {
          const subscriptionPlanName = data.row.original.subscriptionPlanName;
          return (
            <Text size="small" weight="regular" color="#475467" ellipsis>
              {subscriptionPlanName}
            </Text>
          );
        },
      }),
      columnHelper.accessor("memoryGiBHours", {
        id: "memoryGiBHours",
        header: "Memory (GiB hrs)",
        meta: {
          minWidth: 150,
        },
        cell: (data) => {
          const memoryGiBHours = data.row.original.memoryGiBHours;
          return (
            <Text size="small" weight="regular" color="#475467" ellipsis>
              {memoryGiBHours}
            </Text>
          );
        },
      }),
      columnHelper.accessor("storageGiBHours", {
        id: "storageGiBHours",
        header: "Storage (GiB hrs)",
        meta: {
          minWidth: 150,
        },
        cell: (data) => {
          const storageGiBHours = data.row.original.storageGiBHours;
          return (
            <Text size="small" weight="regular" color="#475467" ellipsis>
              {storageGiBHours}
            </Text>
          );
        },
      }),
      columnHelper.accessor("cpuCoreHours", {
        id: "cpuCoreHours",
        header: "CPU (core hrs)",
        meta: {
          minWidth: 150,
        },
        cell: (data) => {
          const cpuCoreHours = data.row.original.cpuCoreHours;
          return (
            <Text size="small" weight="regular" color="#475467" ellipsis>
              {cpuCoreHours}
            </Text>
          );
        },
      }),
    ];
  }, []);

  return (
    <DataTable
      columns={columns}
      rows={rows}
      noRowsText="No subscriptions"
      tableStyles={{
        marginTop: "12px",
        boxShadow: "none",
        border: "none",
        borderRadius: "0px",
        borderBottomRightRadius: "12px",
        borderBottomLeftRadius: "12px",
        borderTop: "1px solid #E4E7EC",
      }}
      isLoading={isLoadingSubscriptionsUsage}
      hidePagination={rows.length < 11}
    />
  );
};

export default SubscriptionUsageTable;
