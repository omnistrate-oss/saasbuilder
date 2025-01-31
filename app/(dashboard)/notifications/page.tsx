"use client";

import { Range } from "react-date-range";
import { useState } from "react";

import PageTitle from "../components/Layout/PageTitle";
import useAuditLogs from "../audit-logs/hooks/useAuditLogs";
import PageContainer from "../components/Layout/PageContainer";
import NotificationsIcon from "../components/Icons/NotificationsIcon";
import NotificationsTableHeader from "./components/NotificationsTableHeader";

import { initialRangeState } from "components/DateRangePicker/DateRangePicker";

import { useGlobalData } from "src/providers/GlobalDataProvider";
import EventsTable from "../components/EventsTable/EventsTable";

const NotificationsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedDateRange, setSelectedDateRange] =
    useState<Range>(initialRangeState);
  const { isFetchingSubscriptions } = useGlobalData();

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
        />
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;
