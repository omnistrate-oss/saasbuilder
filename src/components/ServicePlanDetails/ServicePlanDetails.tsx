"use client";

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Stack, Tab, Tabs } from "@mui/material";

import CardWithTitle from "../Card/CardWithTitle";
import APIDocumentation from "../APIDocumentation/APIDocumentation";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";

import useDownloadCLI from "src/hooks/useDownloadCLI";

type ServicePlanDetailsProps = {
  serviceOffering?: any;
  subscription?: any;
};

type CurrentTab =
  | "plan-details"
  | "documentation"
  | "pricing"
  | "support"
  | "api-documentation"
  | "download-cli";

const tabLabels: any = {
  "plan-details": "Plan Details",
  documentation: "Documentation",
  pricing: "Pricing",
  support: "Support",
  "api-documentation": "API Documentation",
  "download-cli": "Download CLI",
};

const ServicePlanDetails: React.FC<ServicePlanDetailsProps> = ({
  serviceOffering,
  subscription,
}) => {
  const { downloadCLI, isDownloading } = useDownloadCLI();
  const [currentTab, setCurrentTab] = useState<CurrentTab>("plan-details");

  if (!serviceOffering) return null;

  if (!subscription) {
    delete tabLabels["api-documentation"];
    delete tabLabels["download-cli"];
  }

  return (
    <div>
      <Tabs
        value={currentTab}
        centered
        sx={{
          mb: "32px",
          borderBottom: "1px solid #E9EAEB",
        }}
      >
        {Object.keys(tabLabels).map((tab) => (
          <Tab
            key={tab}
            disabled={tab === "download-cli" && isDownloading}
            label={
              tab === "download-cli" ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Download CLI</span>
                  {isDownloading && <LoadingSpinnerSmall />}
                </Stack>
              ) : (
                tabLabels[tab]
              )
            }
            value={tab}
            onClick={() => {
              if (tab === "download-cli") {
                if (!isDownloading) {
                  downloadCLI(
                    serviceOffering.serviceId,
                    serviceOffering.serviceAPIID,
                    subscription?.id
                  );
                }
              } else {
                setCurrentTab(tab as CurrentTab);
              }
            }}
            sx={{
              padding: "4px !important",
              marginRight: "16px !important",
              textTransform: "none",
              fontWeight: "600",
              color: "#717680",
            }}
          />
        ))}
      </Tabs>
      {["plan-details", "documentation", "pricing", "support"].includes(
        currentTab
      ) && (
        <CardWithTitle
          title={tabLabels[currentTab]}
          style={{ minHeight: "500px" }}
        >
          <div className="ql-snow">
            <div
              className={"ql-editor"}
              style={{ wordBreak: "break-word" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  currentTab === "plan-details"
                    ? serviceOffering.productTierPlanDescription
                    : currentTab === "documentation"
                      ? serviceOffering.productTierDocumentation
                      : currentTab === "pricing"
                        ? serviceOffering.productTierPricing?.value
                        : currentTab === "support"
                          ? serviceOffering.productTierSupport
                          : ""
                ),
              }}
            />
          </div>
        </CardWithTitle>
      )}

      {subscription && currentTab === "api-documentation" ? (
        <APIDocumentation
          subscription={subscription}
          serviceAPIID={serviceOffering.serviceAPIID}
        />
      ) : null}
    </div>
  );
};

export default ServicePlanDetails;
