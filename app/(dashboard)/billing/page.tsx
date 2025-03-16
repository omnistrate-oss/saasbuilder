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
import Chip from "components/Chip/Chip";
import Button from "components/Button/Button";
import { DisplayText, Text } from "components/Typography/Typography";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import StaticBilling from "./components/StaticBilling";
import { isStaticBillingEnabled } from "./utils";
import useBillingDetails from "./hooks/useBillingDetails";
import useConsumptionInvoices from "./hooks/useConsumptionInvoices";
import useConsumptionUsage from "./hooks/useConsumptionUsage";
import ConsumptionUsage from "./components/ConsumptionUsage";

const BillingPage = () => {
  const selectUser = useSelector(selectUserrootData);
  const { isLoading, data: billingDetails, error } = useBillingDetails();
  const { data: invoicesData } = useConsumptionInvoices();
  const { data: consumptionUsageData } = useConsumptionUsage();

  const invoices = invoicesData?.invoices || [];

  console.log("invoices", invoices);
  console.log("Consumption usage data", consumptionUsageData);

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

        {isLoading ? (
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
                  <Text size="large" sx={{ display: "inline-block" }}>
                    Payment Method
                  </Text>
                  <Chip
                    sx={{ marginLeft: "10px" }}
                    label={
                      paymentConfigured === true
                        ? "✅ Configured"
                        : "Not Configured"
                    }
                    fontColor={
                      paymentConfigured === true ? "#6941C6" : "#D92D20"
                    }
                    bgColor={paymentConfigured === true ? "#F9F5FF" : "#f3f3f1"}
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
            <ConsumptionUsage />
          </>
        )}
      </PageContainer>
    </div>
  );
};

export default BillingPage;
