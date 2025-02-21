"use client";

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Tab, Tabs } from "src/components/Tab/Tab";

import CardWithTitle from "../Card/CardWithTitle";
import APIDocumentation from "../APIDocumentation/APIDocumentation";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";

import useDownloadCLI from "src/hooks/useDownloadCLI";
import { ServiceOffering } from "src/types/serviceOffering";
import { SecondaryColorButton } from "../Button/Button";
import DownloadCLIIcon from "../Icons/DownloadCLI/DownloadCLIIcon";
import { colors } from "src/themeConfig";

type CurrentTab =
  | "plan-details"
  | "documentation"
  | "pricing"
  | "support"
  | "api-documentation"
  | "download-cli";

type ServicePlanDetailsProps = {
  serviceOffering?: ServiceOffering;
  startingTab?: CurrentTab;
};

const tabLabels = {
  "plan-details": "Plan Details",
  documentation: "Documentation",
  pricing: "Pricing",
  support: "Support",
  "api-documentation": "API Documentation",
};

const ServicePlanDetails: React.FC<ServicePlanDetailsProps> = ({
  serviceOffering,
  startingTab = "plan-details",
}) => {
  const { downloadCLI, isDownloading } = useDownloadCLI();
  const [currentTab, setCurrentTab] = useState<CurrentTab>(startingTab);

  if (!serviceOffering) return null;

  const actionButton = (
    <SecondaryColorButton
      variant="outlined"
      startIcon={
        <DownloadCLIIcon disabled={isDownloading} color={colors.blue700} />
      }
      disabled={isDownloading}
      onClick={() => {
        downloadCLI(serviceOffering.serviceId, serviceOffering.serviceAPIID);
      }}
    >
      Download CLI
      {isDownloading && <LoadingSpinnerSmall />}
    </SecondaryColorButton>
  );

  return (
    <CardWithTitle
      title={serviceOffering.productTierName}
      actionButton={actionButton}
    >
      <Tabs
        value={currentTab}
        centered
        sx={{
          mb: "32px",
        }}
      >
        {Object.keys(tabLabels).map((tab) => (
          <Tab
            key={tab}
            disabled={tab === "download-cli" && isDownloading}
            label={tabLabels[tab]}
            value={tab}
            onClick={() => {
              setCurrentTab(tab as CurrentTab);
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
                        ? // @ts-ignore
                          serviceOffering.productTierPricing?.value
                        : currentTab === "support"
                          ? serviceOffering.productTierSupport
                          : ""
                ),
              }}
            />
          </div>
        </CardWithTitle>
      )}

      {currentTab === "api-documentation" && (
        <APIDocumentation
          serviceId={serviceOffering.serviceId}
          serviceAPIID={serviceOffering.serviceAPIID}
        />
      )}
    </CardWithTitle>
  );
};

export default ServicePlanDetails;
