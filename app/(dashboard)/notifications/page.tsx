"use client";

import { Range } from "react-date-range";
import { useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import PageTitle from "../components/Layout/PageTitle";
import useAuditLogs from "../audit-logs/hooks/useAuditLogs";
import PageContainer from "../components/Layout/PageContainer";
import NotificationsIcon from "../components/Icons/NotificationsIcon";
import NotificationsTableHeader from "./components/NotificationsTableHeader";

import DataGridText from "components/DataGrid/DataGridText";
import EventTypeChip from "components/EventsTable/EventTypeChip";
import EventDetailsView from "components/EventsTable/EventDetailsView";
import EventMessageChip from "components/EventsTable/EventMessageChip";
import { initialRangeState } from "components/DateRangePicker/DateRangePicker";
import ServiceNameWithLogo from "components/ServiceNameWithLogo/ServiceNameWithLogo";
import CursorPaginatedDataTable from "components/DataTable/CursorPaginatedDataTable";

import formatDateUTC from "src/utils/formatDateUTC";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { getAccessControlRoute } from "src/utils/route/access/accessRoute";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

const NotificationsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedDateRange, setSelectedDateRange] =
    useState<Range>(initialRangeState);
  const { subscriptionsObj, isFetchingSubscriptions } = useGlobalData();

  const {
    data: notifications,
    refetch: refetchNotifications,
    isFetching: isFetchingNotifications,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAuditLogs({
    startDate: selectedDateRange.startDate
      ? new Date(selectedDateRange.startDate).toISOString()
      : undefined,
    endDate: selectedDateRange.endDate
      ? new Date(selectedDateRange.endDate).toISOString()
      : undefined,
    eventSourceTypes: ["Infra", "Maintenance"],
  });

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
      columnHelper.accessor("eventSource", {
        id: "type",
        header: "Type",
        cell: (data) => {
          return data.row.original.eventSource ? (
            <EventTypeChip eventType={data.row.original.eventSource} />
          ) : (
            "-"
          );
        },
        meta: {
          flex: 0.8,
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
      <PageTitle icon={NotificationsIcon} className="mb-6">
        Notifications
      </PageTitle>

      <div>
        <CursorPaginatedDataTable
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          columns={dataTableColumns}
          data={notifications}
          renderDetailsComponent={EventDetailsView}
          noRowsText="No events"
          getRowCanExpand={(rowData) =>
            Boolean(rowData.original.workflowFailures?.length > 0)
          }
          HeaderComponent={NotificationsTableHeader}
          headerProps={{
            refetchNotifications: () => {
              setPageIndex(0);
              refetchNotifications();
            },
            selectedDateRange,
            setSelectedDateRange,
            isFetchingNotifications,
          }}
          isLoading={isFetchingNotifications || isFetchingSubscriptions}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          pageSize={10}
        />
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;
