"use client";

import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useSelector } from "react-redux";

import PageTitle from "../components/Layout/PageTitle";
import SettingsIcon from "../components/Icons/SettingsIcon";
import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";

import { tabLabels } from "./constants";
import ProfileForm from "./components/ProfileForm";
import PasswordForm from "./components/PasswordForm";
import PageContainer from "../components/Layout/PageContainer";
import BillingAddressForm from "./components/BillingAddressForm";

import { colors } from "src/themeConfig";
import useUserData from "src/hooks/usersData";
import { selectUserrootData } from "src/slices/userDataSlice";

type CurrentTab = "profile" | "billingAddress" | "password";

const SettingsPage = () => {
  const selectUser = useSelector(selectUserrootData);
  const { refetch: refetchUserData, isLoading: isLoadingUserData } =
    useUserData();
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
            borderBottom: "1px solid #E9EAEB",
          }}
        >
          <Tab
            label={tabLabels.profile}
            value={"profile"}
            onClick={() => setCurrentTab("profile")}
            sx={{
              padding: "4px !important",
              marginRight: "16px !important",
              textTransform: "none",
              fontWeight: "600",
              color: colors.purple700,
            }}
          />
          <Tab
            label={tabLabels.billingAddress}
            value={"billingAddress"}
            onClick={() => setCurrentTab("billingAddress")}
            sx={{
              padding: "4px !important",
              marginRight: "16px !important",
              textTransform: "none",
              fontWeight: "600",
              color: colors.purple700,
            }}
          />
          <Tab
            label={tabLabels.password}
            value={"password"}
            onClick={() => setCurrentTab("password")}
            sx={{
              padding: "4px !important",
              marginRight: "16px !important",
              textTransform: "none",
              fontWeight: "600",
              color: colors.purple700,
            }}
          />
        </Tabs>

        {currentTab === "profile" && (
          <ProfileForm
            userData={selectUser}
            refetchUserData={refetchUserData}
            isLoadingUserData={isLoadingUserData}
          />
        )}
        {currentTab === "billingAddress" && (
          <BillingAddressForm
            userData={selectUser}
            refetchUserData={refetchUserData}
            isLoadingUserData={isLoadingUserData}
          />
        )}
        {currentTab === "password" && <PasswordForm />}
      </PageContainer>
    </div>
  );
};

export default SettingsPage;
