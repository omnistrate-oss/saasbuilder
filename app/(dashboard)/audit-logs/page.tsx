"use client";

import { IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import useAuditLogs from "./hooks/useAuditLogs";
import PageTitle from "../components/Layout/PageTitle";
import AuditLogsIcon from "../components/Icons/AuditLogsIcon";
import PageContainer from "../components/Layout/PageContainer";
import AuditLogsTableHeader from "./components/AuditLogsTableHeader";

import formatDateUTC from "src/utils/formatDateUTC";
import { useGlobalData } from "src/providers/GlobalDataProvider";

import EventMessageChip from "components/EventsTable/EventMessageChip";
import EventDetailsView from "components/EventsTable/EventDetailsView";
import { initialRangeState } from "components/DateRangePicker/DateTimeRangePickerStatic";
import ServiceNameWithLogo from "components/ServiceNameWithLogo/ServiceNameWithLogo";
import CursorPaginatedDataTable from "components/DataTable/CursorPaginatedDataTable";
import DataGridText from "src/components/DataGrid/DataGridText";
import { getAccessControlRoute } from "src/utils/route/access/accessRoute";
import { AuditEvent } from "src/types/auditEvent";
import { DateRange } from "src/components/DateRangePicker/DateTimeRangePickerStatic";

const columnHelper = createColumnHelper<AuditEvent>();

const AuditLogsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRange>(initialRangeState);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const { subscriptionsObj, serviceOfferings, isFetchingSubscriptions } =
    useGlobalData();

  const {
    data: auditLogs,
    refetch: refetchAuditLogs,
    isFetching: isFetchingAuditLogs,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAuditLogs({
    startDate: selectedDateRange.startDate ?? undefined,
    endDate: selectedDateRange.endDate ?? undefined,
    eventSourceTypes: "Customer",
    serviceID: selectedServiceId,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [selectedDateRange, selectedServiceId]);

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.display({
        id: "expandAction",
        header: "",
        cell: (data) => {
          const isRowExpandible = data.row.getCanExpand();
          return isRowExpandible ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={data.row.getToggleExpandedHandler()}
              disabled={!isRowExpandible}
            >
              {data.row.getIsExpanded() ? (
                <RemoveCircleOutlineIcon sx={{ fontSize: "20px" }} />
              ) : (
                <AddCircleOutlineIcon sx={{ fontSize: "20px" }} />
              )}
            </IconButton>
          ) : (
            ""
          );
        },
        meta: {
          width: 60,
        },
      }),
      columnHelper.accessor("resourceInstanceId", {
        id: "resourceInstanceId",
        header: "Deployment ID",
        meta: {
          minWidth: 200,
        },
      }),
      columnHelper.accessor(
        (row) => {
          const subscription = subscriptionsObj[row.subscriptionId];
          return subscription?.serviceName || "-";
        },
        {
          id: "serviceName",
          header: "Service Name",
          cell: (data) => {
            const { serviceLogoURL, serviceName } =
              subscriptionsObj[data.row.original.subscriptionId] || {};
            if (!serviceName) return "-";

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
      columnHelper.accessor("resourceName", {
        id: "resourceName",
        header: "Resource Type",
      }),
      columnHelper.accessor((row) => formatDateUTC(row.time), {
        id: "time",
        header: "Time",
        cell: (data) =>
          data.row.original.time ? formatDateUTC(data.row.original.time) : "-",
        meta: {
          minWidth: 200,
        },
      }),
      columnHelper.accessor("message", {
        id: "message",
        header: "Message",
        cell: (data) => {
          return data.row.original.message ? (
            <EventMessageChip message={data.row.original.message} />
          ) : (
            "-"
          );
        },
        meta: {
          flex: 2,
        },
      }),
      columnHelper.accessor("userName", {
        id: "userName",
        header: "User",
        cell: (data) => {
          const userId = data.row.original.userId;
          const userName = data.row.original.userName;
          const orgName = data.row.original.orgName;

          const isUserOmnistrateSystem =
            userName === "System" && orgName === "System";

          let pageLink = "",
            props = {};
          if (!isUserOmnistrateSystem && userId) {
            pageLink = getAccessControlRoute(userId);
            props = {
              color: "primary",
              linkProps: {
                href: pageLink,
                target: "_blank",
              },
            };
          }

          return <DataGridText {...props}>{userName || "-"}</DataGridText>;
        },
      }),
      columnHelper.accessor(
        (row) => {
          return subscriptionsObj[row.subscriptionId]?.productTierName || "-";
        },
        {
          id: "servicePlanName",
          header: "Subscription Plan",
        }
      ),
      columnHelper.accessor(
        (row) => {
          return (
            subscriptionsObj[row.subscriptionId]?.subscriptionOwnerName || "-"
          );
        },
        {
          id: "subscriptionOwnerName",
          header: "Subscription Owner",
        }
      ),
    ];
  }, [subscriptionsObj]);

  return (
    <PageContainer>
      <PageTitle icon={AuditLogsIcon} className="mb-6">
        Audit Logs
      </PageTitle>

      <div>
        <CursorPaginatedDataTable
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          columns={dataTableColumns}
          data={auditLogs}
          renderDetailsComponent={EventDetailsView}
          noRowsText="No events"
          getRowCanExpand={(rowData) =>
            Number(rowData.original.workflowFailures?.length) > 0
          }
          HeaderComponent={AuditLogsTableHeader}
          headerProps={{
            refetchAuditLogs: () => {
              setPageIndex(0);
              refetchAuditLogs();
            },
            selectedDateRange,
            setSelectedDateRange,
            isFetchingAuditLogs,
            selectedServiceId,
            setSelectedServiceId,
            serviceOfferings,
          }}
          isLoading={isFetchingAuditLogs || isFetchingSubscriptions}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          pageSize={10}
          rowId="id"
        />
      </div>
    </PageContainer>
  );
};

export default AuditLogsPage;
