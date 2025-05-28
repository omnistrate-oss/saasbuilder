"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";

import StatusChip from "src/components/StatusChip/StatusChip";
import { selectUserrootData } from "src/slices/userDataSlice";
import Button from "components/Button/Button";
import Card from "components/Card/Card";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import { DisplayText, Text } from "components/Typography/Typography";

import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";
import BillingIcon from "../components/Icons/BillingIcon";
import PageContainer from "../components/Layout/PageContainer";
import PageTitle from "../components/Layout/PageTitle";

import ConsumptionUsage from "./components/ConsumptionUsage";
import InvoicesTable from "./components/InvoicesTable";
import useBillingDetails from "./hooks/useBillingDetails";
import useBillingStatus from "./hooks/useBillingStatus";
import useConsumptionInvoices from "./hooks/useConsumptionInvoices";
import useConsumptionUsage from "./hooks/useConsumptionUsage";

const BillingPage = () => {
  const selectUser = useSelector(selectUserrootData);

  const billingStatusQuery = useBillingStatus();

  const isBillingEnabled = Boolean(billingStatusQuery.data?.enabled);

  const { isPending: isBillingDetailsPending, data: billingDetails, error } = useBillingDetails(isBillingEnabled);

  const { data: consumptionUsageData, isPending: isConsumptionDataPending } = useConsumptionUsage();

  const { data: invoicesData, isPending: isInvoicesPending } = useConsumptionInvoices();

  const invoices = useMemo(() => invoicesData?.invoices || [], [invoicesData]);

  const [paymentURL, setPaymentURL] = useState("");

  useEffect(() => {
    const firstOpenInvoice = invoices.find((invoice) => invoice.invoiceStatus === "open");
    const paymentURL = firstOpenInvoice?.invoiceUrl;
    if (paymentURL) {
      setPaymentURL(paymentURL);
    }
  }, [invoices]);

  const invoicesTotalAmount = invoices.reduce((acc, invoice) => {
    if (invoice.invoiceStatus === "open") {
      acc = acc + (invoice.totalAmount || 0);
    }
    return acc;
  }, 0);

  const paymentConfigured = billingDetails?.paymentConfigured;
  let errorDisplayText = "";

  if (error) {
    // @ts-ignore
    const errorMessage = error?.response?.data?.message;
    errorDisplayText =
      "Something went wrong. Try refreshing the page. If the issue persists please contact support for assistance";

    if (errorMessage) {
      if (
        errorMessage === "Your provider has not enabled billing for the user." ||
        errorMessage === "Your provider has not enabled billing for the services."
      ) {
        errorDisplayText = "Billing has not been configured. Please contact support for assistance";
      }

      if (errorMessage === "You have not been subscribed to a service yet.") {
        errorDisplayText = "Please subscribe to a service to start using billing";
      }

      if (errorMessage === "You have not been enrolled in a service plan with a billing plan yet.") {
        errorDisplayText =
          "You have not been enrolled in a service plan with a billing plan. Please contact support for assistance";
      } else {
        errorDisplayText = errorMessage;
      }
    }
  }

  const isLoading = isBillingDetailsPending || isConsumptionDataPending || isInvoicesPending;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <AccountManagementHeader userName={selectUser?.name} userEmail={selectUser?.email} />
      <PageContainer>
        <PageTitle icon={BillingIcon} className="mb-6">
          Billing
        </PageTitle>

        {isLoading ? (
          <LoadingSpinner />
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
            <Box display="grid" gap="24px" gridTemplateColumns="1fr 1fr">
              <Card sx={{ boxShadow: "0px 1px 2px 0px #0A0D120D" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Text size="large" weight="semibold" color="#181D27">
                      Balance
                    </Text>
                    <Text size="small" weight="regular" color="#535862" marginTop="2px">
                      Pay open invoices amount
                    </Text>
                  </Box>
                </Stack>
                <Stack direction="row" gap="24px" justifyContent="space-between" marginTop="10px">
                  {/*@ts-ignore */}
                  <DisplayText size="small" weight="semibold">
                    ${invoicesTotalAmount}
                  </DisplayText>
                  {paymentURL ? (
                    <Link href={paymentURL} target="_blank">
                      <Button
                        variant="contained"
                        endIcon={
                          <ArrowOutwardIcon
                            sx={{
                              fontSize: "18px",
                            }}
                          />
                        }
                      >
                        Pay Now
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="contained"
                      endIcon={
                        <ArrowOutwardIcon
                          sx={{
                            fontSize: "18px",
                          }}
                        />
                      }
                      disabled={!paymentURL}
                    >
                      Pay Now
                    </Button>
                  )}
                </Stack>
              </Card>
              <Card sx={{ boxShadow: "0px 1px 2px 0px #0A0D120D" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Text size="large" weight="semibold" color="#181D27">
                      Payment Method
                    </Text>
                    <Text size="small" weight="regular" color="#535862" marginTop="2px">
                      Change how you pay for your plan
                    </Text>
                  </Box>
                </Stack>

                <Stack direction="row" gap="24px" justifyContent="space-between" marginTop="10px">
                  <StatusChip
                    label={paymentConfigured === true ? "Configured" : "Not Configured"}
                    category={paymentConfigured === true ? "success" : "failed"}
                    sx={{ alignSelf: "center" }}
                  />
                  {billingDetails?.paymentInfoPortalURL ? (
                    <Link href={billingDetails?.paymentInfoPortalURL} target="_blank">
                      <Button
                        variant="contained"
                        endIcon={
                          <ArrowOutwardIcon
                            sx={{
                              fontSize: "18px",
                            }}
                          />
                        }
                      >
                        Configure
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="contained"
                      endIcon={
                        <ArrowOutwardIcon
                          sx={{
                            fontSize: "18px",
                          }}
                        />
                      }
                      disabled
                    >
                      Configure
                    </Button>
                  )}
                </Stack>
              </Card>
            </Box>

            <ConsumptionUsage consumptionUsageData={consumptionUsageData} />

            <InvoicesTable invoices={invoices} />
          </>
        )}
      </PageContainer>
    </div>
  );
};

export default BillingPage;
