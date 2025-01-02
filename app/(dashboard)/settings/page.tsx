"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import PageTitle from "../components/Layout/PageTitle";
import SettingsIcon from "../components/Icons/SettingsIcon";
import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";
import { Tab, Tabs } from "src/components/Tab/Tab";
import { selectUserrootData } from "src/slices/userDataSlice";

import { tabLabels } from "./constants";
import PageContainer from "../components/Layout/PageContainer";

type CurrentTab = "profile" | "billingAddress" | "password";

const SettingsPage = () => {
  const selectUser = useSelector(selectUserrootData);
  const [currentTab, setCurrentTab] = useState<CurrentTab>("profile");

  return (
    <div>
      <AccountManagementHeader
        userName={selectUser?.name}
        userEmail={selectUser?.email}
      />
      <PageContainer>
        <PageTitle icon={SettingsIcon} className="mb-6">
          Settings
        </PageTitle>

        <Tabs
          value={currentTab}
          sx={{
            mb: "24px",
          }}
        >
          <Tab
            label={tabLabels.profile}
            value={"profile"}
            onClick={() => setCurrentTab("profile")}
            sx={{ padding: "4px !important", marginRight: "16px !important" }}
          />
          <Tab
            label={tabLabels.billingAddress}
            value={"billingAddress"}
            onClick={() => setCurrentTab("billingAddress")}
            sx={{ padding: "4px !important", marginRight: "16px !important" }}
          />
          <Tab
            label={tabLabels.password}
            value={"password"}
            onClick={() => setCurrentTab("password")}
            sx={{ padding: "4px !important", marginRight: "16px !important" }}
          />
        </Tabs>

        {currentTab === "profile" && <div>Profile</div>}
        {currentTab === "billingAddress" && <div>Billing Address</div>}
        {currentTab === "password" && <div>Password</div>}
      </PageContainer>
    </div>
  );
};

export default SettingsPage;
