"use client";

import { Range } from "react-date-range";
import { useEffect, useState } from "react";

import useAuditLogs from "./hooks/useAuditLogs";
import PageTitle from "../components/Layout/PageTitle";
import AuditLogsIcon from "../components/Icons/AuditLogsIcon";
import PageContainer from "../components/Layout/PageContainer";
import AuditLogsTableHeader from "./components/AuditLogsTableHeader";

import { useGlobalData } from "src/providers/GlobalDataProvider";

import { initialRangeState } from "components/DateRangePicker/DateRangePicker";
import EventsTable from "../components/EventsTable/EventsTable";

const AuditLogsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedDateRange, setSelectedDateRange] =
    useState<Range>(initialRangeState);
  const { isFetchingSubscriptions } = useGlobalData();

  const {
    data: auditLogs,
    refetch: refetchAuditLogs,
    isFetching: isFetchingAuditLogs,
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
    eventSourceTypes: "Customer",
  });

  useEffect(() => {
    setPageIndex(0);
  }, [selectedDateRange]);

  return (
    <PageContainer>
      <PageTitle icon={AuditLogsIcon} className="mb-6">
        Audit Logs
      </PageTitle>

      <div>
        <EventsTable
          HeaderComponent={AuditLogsTableHeader}
          HeaderProps={{
            refetchAuditLogs: () => {
              setPageIndex(0);
              refetchAuditLogs();
            },
            selectedDateRange,
            setSelectedDateRange,
            isFetchingAuditLogs,
          }}
          columns={[
            "expand",
            "deploymentId",
            "serviceName",
            "resourceType",
            "time",
            "type",
            "message",
            "user",
            "subscriptionPlan",
            "subscriptionOwner",
          ]}
          data={auditLogs}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isFetchingAuditLogs || isFetchingSubscriptions}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          showPagination={true}
        />
      </div>
    </PageContainer>
  );
};

export default AuditLogsPage;
