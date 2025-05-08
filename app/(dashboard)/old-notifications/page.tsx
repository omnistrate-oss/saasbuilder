"use client";

import { useEffect, useState } from "react";

import PageTitle from "../components/Layout/PageTitle";
import useAuditLogs from "../audit-logs/hooks/useAuditLogs";
import PageContainer from "../components/Layout/PageContainer";
import NotificationsIcon from "../components/Icons/NotificationsIcon";
import NotificationsTableHeader from "./components/NotificationsTableHeader";

import { useGlobalData } from "src/providers/GlobalDataProvider";
import { DateRange, initialRangeState } from "src/components/DateRangePicker/DateTimeRangePickerStatic";
import EventsTable from "../components/EventsTable/EventsTable";
import { EventType } from "src/types/event";

const NotificationsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(initialRangeState);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const { serviceOfferings, isFetchingSubscriptions } = useGlobalData();

  const {
    data: notifications,
    refetch: refetchNotifications,
    isFetching: isFetchingNotifications,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAuditLogs({
    startDate: selectedDateRange.startDate ?? undefined,
    endDate: selectedDateRange.endDate ?? undefined,
    eventSourceTypes: selectedEventTypes?.length ? selectedEventTypes : ["Infra", "Maintenance"],
    serviceID: selectedServiceId,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [selectedDateRange, selectedEventTypes, selectedServiceId]);

  return (
    <PageContainer>
      <PageTitle icon={NotificationsIcon} className="mb-6">
        Notifications
      </PageTitle>

      <div>
        <EventsTable
          HeaderComponent={NotificationsTableHeader}
          HeaderProps={{
            refetchNotifications: () => {
              setPageIndex(0);
              refetchNotifications();
            },
            selectedDateRange,
            setSelectedDateRange,
            isFetchingNotifications,
            selectedEventTypes,
            setSelectedEventTypes,
            selectedServiceId,
            setSelectedServiceId,
            serviceOfferings,
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
          data={notifications}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isFetchingNotifications || isFetchingSubscriptions}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          showPagination={true}
          noRowsText="No notifications"
        />
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;
