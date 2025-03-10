"use client";

import { useEffect, useState } from "react";
import useAuditLogs from "./hooks/useAuditLogs";
import PageTitle from "../components/Layout/PageTitle";
import AuditLogsIcon from "../components/Icons/AuditLogsIcon";
import PageContainer from "../components/Layout/PageContainer";
import EventsTableHeader from "./components/EventsTableHeader";

import { useGlobalData } from "src/providers/GlobalDataProvider";

import { initialRangeState } from "components/DateRangePicker/DateTimeRangePickerStatic";
import { DateRange } from "src/components/DateRangePicker/DateTimeRangePickerStatic";
import EventsTable from "../components/EventsTable/EventsTable";
import { EventType } from "src/types/event";

const EventsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRange>(initialRangeState);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);

  const { serviceOfferings, isLoadingSubscriptions } = useGlobalData();

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
    eventSourceTypes: selectedEventTypes?.length
      ? selectedEventTypes
      : ["Customer", "Infra", "Maintenance"],
    serviceID: selectedServiceId,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [selectedDateRange, selectedServiceId]);

  return (
    <PageContainer>
      <PageTitle icon={AuditLogsIcon} className="mb-6">
        Events
      </PageTitle>

      <div>
        <EventsTable
          HeaderComponent={EventsTableHeader}
          HeaderProps={{
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
            selectedEventTypes,
            setSelectedEventTypes,
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
          isLoading={isFetchingAuditLogs || isLoadingSubscriptions}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          showPagination={true}
          noRowsText="No audit logs"
        />
      </div>
    </PageContainer>
  );
};

export default EventsPage;
