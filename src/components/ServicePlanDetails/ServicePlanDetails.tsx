"use client";

import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";

import CardWithTitle from "../Card/CardWithTitle";

type CurrentTab = "plan-details" | "documentation" | "pricing" | "support";
const tabLabels = {
  "plan-details": "Plan Details",
  documentation: "Documentation",
  pricing: "Pricing",
  support: "Support",
};

const ServicePlanDetails = ({
  planDetails,
  documentation,
  pricing,
  support,
}) => {
  const [currentTab, setCurrentTab] = useState<CurrentTab>("plan-details");

  return (
    <div className="px-8 pt-8 pb-12">
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
            label={tabLabels[tab]}
            value={tab}
            onClick={() => setCurrentTab(tab as CurrentTab)}
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
                  ? planDetails
                  : currentTab === "documentation"
                    ? documentation
                    : currentTab === "pricing"
                      ? pricing
                      : currentTab === "support"
                        ? support
                        : ""
              ),
            }}
          />
        </div>
      </CardWithTitle>
    </div>
  );
};

export default ServicePlanDetails;
