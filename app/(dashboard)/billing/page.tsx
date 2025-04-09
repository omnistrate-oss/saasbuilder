"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { Box, Stack } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import PageTitle from "../components/Layout/PageTitle";
import BillingIcon from "../components/Icons/BillingIcon";
import PageContainer from "../components/Layout/PageContainer";
import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";
import { selectUserrootData } from "src/slices/userDataSlice";
import Card from "components/Card/Card";
import Button from "components/Button/Button";
import { DisplayText, Text } from "components/Typography/Typography";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import StaticBilling from "./components/StaticBilling";
import { isStaticBillingEnabled } from "./utils";
import useBillingDetails from "./hooks/useBillingDetails";
import ConsumptionUsage from "./components/ConsumptionUsage";
import InvoicesTable from "./components/InvoicesTable";
import useConsumptionUsage from "./hooks/useConsumptionUsage";
import StatusChip from "src/components/StatusChip/StatusChip";
import useConsumptionUsagePerDay from "./hooks/useConsumptionUsagePerDay";
import UsageOverview from "./components/UsageOverview";
import { useState } from "react";
import { DateRange } from "src/components/DateRangePicker/DateTimeRangePickerStatic";
import { getEndOfCurrentUTCDay, getFirstDayOfUTCMonth } from "src/utils/time";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const defaultDailyDateRange = {
  startDate: getFirstDayOfUTCMonth(),
  endDate: getEndOfCurrentUTCDay(),
};

const BillingPage = () => {
  const selectUser = useSelector(selectUserrootData);
  const { isLoading, data: billingDetails, error } = useBillingDetails();
  const [dateRange, setDateRange] = useState<DateRange>(defaultDailyDateRange);
  const [selectedSubscriptionId, setSelectedSubscriptionId] =
    useState<string>("");
  const { data: consumptionUsageData, isLoading: isLoadingConsumptionData } =
    useConsumptionUsage();

  let filterEndDate;
  if (dateRange.endDate) {
    //add 1 day to end date to get data, otherwise backend doesn't send the data for last date
    filterEndDate = dayjs.utc(dateRange.endDate).add(1, "day").toISOString();
  }

  const { data: usagePerDayData, isFetching: isFetchingUsagePerDay } =
    useConsumptionUsagePerDay({
      startDate: dateRange.startDate,
      endDate: filterEndDate,
      subscriptionID:
        selectedSubscriptionId.trim() !== ""
          ? selectedSubscriptionId
          : undefined,
    });

  const paymentConfigured = billingDetails?.paymentConfigured;
  let errorDisplayText = "";

  if (error) {
    // @ts-ignore
    const errorMessage = error?.response?.data?.message;
    errorDisplayText =
      "Something went wrong. Try refreshing the page. If the issue persists please contact support for assistance";

    if (errorMessage) {
      if (
        errorMessage ===
          "Your provider has not enabled billing for the user." ||
        errorMessage ===
          "Your provider has not enabled billing for the services."
      ) {
        errorDisplayText =
          "Billing has not been configured. Please contact support for assistance";
      }

      if (errorMessage === "You have not been subscribed to a service yet.") {
        errorDisplayText =
          "Please subscribe to a service to start using billing";
      }

      if (
        errorMessage ===
        "You have not been enrolled in a service plan with a billing plan yet."
      ) {
        errorDisplayText =
          "You have not been enrolled in a service plan with a billing plan. Please contact support for assistance";
      } else {
        errorDisplayText = errorMessage;
      }
    }
  }

  return (
    <div>
      <AccountManagementHeader
        userName={selectUser?.name}
        userEmail={selectUser?.email}
      />
      <PageContainer>
        <PageTitle icon={BillingIcon} className="mb-6">
          Billing
        </PageTitle>

        {isLoading || isLoadingConsumptionData ? (
          <LoadingSpinner />
        ) : isStaticBillingEnabled(selectUser) ? (
          <StaticBilling />
        ) : error ? (
          <Stack p={3} pt="200px" alignItems="center" justifyContent="center">
            <DisplayText
              // @ts-ignore
              size="xsmall"
              sx={{
                wordBreak: "break-word",
                textAlign: "center",
                maxWidth: 900,
              }}
            >
              {errorDisplayText}
            </DisplayText>
          </Stack>
        ) : (
          <>
            <Card sx={{ mt: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Text size="large">Payment Method</Text>
                  <StatusChip
                    label={
                      paymentConfigured === true
                        ? "Configured"
                        : "Not Configured"
                    }
                    category={
                      paymentConfigured === true ? "success" : "pending"
                    }
                  />
                </Box>
                <Link
                  href={billingDetails?.paymentInfoPortalURL ?? ""}
                  target="_blank"
                >
                  <Button variant="outlined">
                    Configure Payment Method
                    <ArrowOutwardIcon
                      sx={{
                        marginLeft: "6px",
                        fontSize: "18px",
                      }}
                    />
                  </Button>
                </Link>
              </Stack>
            </Card>
            <ConsumptionUsage
              consumptionUsageData={consumptionUsageData}
              //consumptionUsagePerDayData={consumptionUsagePerDayData}
            />
            <UsageOverview
              consumptionUsagePerDayData={usagePerDayData}
              isFetchingUsagePerDay={isFetchingUsagePerDay}
              dateRange={dateRange}
              setDateRange={setDateRange}
              initialDateRangeState={defaultDailyDateRange}
              selectedSubscriptionId={selectedSubscriptionId}
              setSelectedSubscriptionId={setSelectedSubscriptionId}
            />
            <InvoicesTable />
          </>
        )}
      </PageContainer>
    </div>
  );
};

export default BillingPage;
