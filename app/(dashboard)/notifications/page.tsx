"use client";

import { Range } from "react-date-range";
import { useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import PageTitle from "../components/Layout/PageTitle";
import PageContainer from "../components/Layout/PageContainer";
import NotificationsIcon from "../components/Icons/NotificationsIcon";
import NotificationsTableHeader from "./components/NotificationsTableHeader";

import DataTable from "components/DataTable/DataTable";
import EventTypeChip from "components/EventsTable/EventTypeChip";
import EventDetailsView from "components/EventsTable/EventDetailsView";
import EventMessageChip from "components/EventsTable/EventMessageChip";
import { initialRangeState } from "components/DateRangePicker/DateRangePicker";
// import ServiceNameWithLogo from "components/ServiceNameWithLogo/ServiceNameWithLogo";

import formatDateUTC from "src/utils/formatDateUTC";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

const NotificationsPage = () => {
  const [selectedDateRange, setSelectedDateRange] =
    useState<Range>(initialRangeState);

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
          width: 75,
        },
      }),
      columnHelper.accessor("resourceInstanceId", {
        id: "resourceInstanceId",
        header: "Deployment ID",
      }),
      // TODO: Check this, we're not getting this data
      // columnHelper.accessor("serviceName", {
      //   id: "serviceName",
      //   header: "Service Name",
      //   cell: (data) => {
      //     const { serviceName, serviceLogoURL } = data.row.original;
      //     return (
      //       <ServiceNameWithLogo
      //         serviceName={serviceName}
      //         serviceLogoURL={serviceLogoURL}
      //       />
      //     );
      //   },
      //   meta: {
      //     minWidth: 230,
      //   },
      // }),
      columnHelper.accessor("resourceName", {
        id: "resourceName",
        header: "Resource Name",
        meta: {
          flex: 0.7,
        },
      }),
      columnHelper.accessor((row) => formatDateUTC(row.time), {
        id: "time",
        header: "Time",
        cell: (data) =>
          data.row.original.time ? formatDateUTC(data.row.original.time) : "-",
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
      }),
    ];
  }, []);

  return (
    <PageContainer>
      <PageTitle icon={NotificationsIcon} className="mb-6">
        Notifications
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={[]}
          noRowsText="No notifications"
          HeaderComponent={NotificationsTableHeader}
          headerProps={{
            selectedDateRange,
            setSelectedDateRange,
          }}
          isLoading={false}
          disableRowSelection
          getRowCanExpand={(rowData) =>
            Boolean(rowData.original.workflowFailures?.length > 0)
          }
          renderDetailsComponent={EventDetailsView}
        />
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;
