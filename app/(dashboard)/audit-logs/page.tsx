"use client";

import { Range } from "react-date-range";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import PageTitle from "../components/Layout/PageTitle";
import AuditLogsIcon from "../components/Icons/AuditLogsIcon";
import PageContainer from "../components/Layout/PageContainer";
import DataTable from "src/components/DataTable/DataTable";
import AuditLogsTableHeader from "./components/AuditLogsTableHeader";
import formatDateUTC from "src/utils/formatDateUTC";
import EventMessageChip from "src/components/EventsTable/EventMessageChip";
import { initialRangeState } from "src/components/DateRangePicker/DateRangePicker";

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
        />
      </div>
    </PageContainer>
  );
};

export default AuditLogsPage;
