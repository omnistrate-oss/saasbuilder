"use client";

import { Range } from "react-date-range";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import PageTitle from "../components/Layout/PageTitle";
import AuditLogsIcon from "../components/Icons/AuditLogsIcon";
import PageContainer from "../components/Layout/PageContainer";
import AuditLogsTableHeader from "./components/AuditLogsTableHeader";

import formatDateUTC from "src/utils/formatDateUTC";

import DataTable from "components/DataTable/DataTable";
import EventMessageChip from "components/EventsTable/EventMessageChip";
import { initialRangeState } from "components/DateRangePicker/DateRangePicker";
import EventDetailsView from "src/components/EventsTable/EventDetailsView";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

const AuditLogsPage = () => {
  const [selectedDateRange, setSelectedDateRange] =
    useState<Range>(initialRangeState);

  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor((row) => formatDateUTC(row.time), {
        id: "time",
        header: "Time",
        cell: (data) =>
          data.row.original.time ? formatDateUTC(data.row.original.time) : "-",
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
      <PageTitle icon={AuditLogsIcon} className="mb-6">
        Audit Logs
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={[]}
          noRowsText="No logs"
          HeaderComponent={AuditLogsTableHeader}
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

export default AuditLogsPage;
