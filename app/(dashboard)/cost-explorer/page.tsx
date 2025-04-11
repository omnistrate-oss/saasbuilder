"use client";

import { useSelector } from "react-redux";
import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";
import { selectUserrootData } from "src/slices/userDataSlice";
import PageContainer from "../components/Layout/PageContainer";
import PageTitle from "../components/Layout/PageTitle";
import CostExplorerIcon from "../components/Icons/CostExplorer";
import UsageOverview from "./components/UsageOverview";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getEndOfCurrentUTCDay, getFirstDayOfUTCMonth } from "src/utils/time";
import { useState } from "react";
import { DateRange } from "src/components/DateRangePicker/DateTimeRangePickerStatic";
import useConsumptionUsagePerDay from "../billing/hooks/useConsumptionUsagePerDay";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
dayjs.extend(utc);

const defaultDailyDateRange = {
  startDate: getFirstDayOfUTCMonth(),
  endDate: getEndOfCurrentUTCDay(),
};

function CostExplorerPage() {
  const selectUser = useSelector(selectUserrootData);
  const [dateRange, setDateRange] = useState<DateRange>(defaultDailyDateRange);
  const [selectedSubscriptionId, setSelectedSubscriptionId] =
    useState<string>("");

  let filterEndDate;
  if (dateRange.endDate) {
    //add 1 day to end date to get data, otherwise backend doesn't send the data for last date
    filterEndDate = dayjs.utc(dateRange.endDate).add(1, "day").toISOString();
  }

  const {
    data: usagePerDayData,
    isFetching: isFetchingUsagePerDay,
    isLoading,
  } = useConsumptionUsagePerDay({
    startDate: dateRange.startDate,
    endDate: filterEndDate,
    subscriptionID:
      selectedSubscriptionId.trim() !== "" ? selectedSubscriptionId : undefined,
  });

  return (
    <div>
      <AccountManagementHeader
        userName={selectUser?.name}
        userEmail={selectUser?.email}
      />
      <PageContainer>
        <PageTitle icon={CostExplorerIcon} className="mb-6">
          Cost Explorer
        </PageTitle>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <UsageOverview
            consumptionUsagePerDayData={usagePerDayData}
            isFetchingUsagePerDay={isFetchingUsagePerDay}
            dateRange={dateRange}
            setDateRange={setDateRange}
            initialDateRangeState={defaultDailyDateRange}
            selectedSubscriptionId={selectedSubscriptionId}
            setSelectedSubscriptionId={setSelectedSubscriptionId}
          />
        )}
      </PageContainer>
    </div>
  );
}

export default CostExplorerPage;
