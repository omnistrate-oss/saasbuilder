"use client";

import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useSelector } from "react-redux";

import useEnvironmentType from "src/hooks/useEnvironmentType";
import useUserData from "src/hooks/usersData";
import { selectUserrootData } from "src/slices/userDataSlice";
import { colors } from "src/themeConfig";

import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";
import SettingsIcon from "../components/Icons/SettingsIcon";
import PageContainer from "../components/Layout/PageContainer";
import PageTitle from "../components/Layout/PageTitle";

import DeleteAccount from "./components/DeleteAccount";
import PasswordForm from "./components/PasswordForm";
import ProfileForm from "./components/ProfileForm";
import { tabLabels } from "./constants";

type CurrentTab = "profile" | "deleteAccount" | "password";

const SettingsPage = () => {
  const selectUser = useSelector(selectUserrootData);
  const { refetch: refetchUserData, isLoading: isLoadingUserData } = useUserData();
  const [currentTab, setCurrentTab] = useState<CurrentTab>("profile");
  const environmentType = useEnvironmentType();

  const isProduction = environmentType === "PROD";

  return (
    <div>
      <AccountManagementHeader userName={selectUser?.name} userEmail={selectUser?.email} />
      <PageContainer>
        <PageTitle icon={SettingsIcon} className="mb-6">
          Settings
        </PageTitle>

        <Tabs
          value={currentTab}
          sx={{
            mb: "24px",
            borderBottom: "1px solid #E9EAEB",
            "& .MuiTabs-indicator": {
              backgroundColor: colors.purple700,
            },
          }}
        >
          <Tab
            label={tabLabels.profile}
            value={"profile"}
            onClick={() => setCurrentTab("profile")}
            sx={{
              paddingY: "12px !important",
              paddingX: "16px !important",
              minWidth: "0px",
              textTransform: "none",
              fontWeight: "600",
              "&.Mui-selected": {
                color: colors.purple700,
              },
            }}
          />

          <Tab
            label={tabLabels.password}
            value={"password"}
            onClick={() => setCurrentTab("password")}
            sx={{
              paddingY: "12px !important",
              paddingX: "16px !important",
              minWidth: "0px",
              textTransform: "none",
              fontWeight: "600",
              "&.Mui-selected": {
                color: colors.purple700,
              },
            }}
          />
          {isProduction && (
            <Tab
              label={tabLabels.deleteAccount}
              value={"deleteAccount"}
              onClick={() => setCurrentTab("deleteAccount")}
              sx={{
                paddingY: "12px !important",
                paddingX: "16px !important",
                minWidth: "0px",
                textTransform: "none",
                fontWeight: "600",
                "&.Mui-selected": {
                  color: colors.purple700,
                },
              }}
            />
          )}
        </Tabs>

        {currentTab === "profile" && (
          <ProfileForm userData={selectUser} refetchUserData={refetchUserData} isLoadingUserData={isLoadingUserData} />
        )}

        {currentTab === "password" && <PasswordForm email={selectUser?.email} />}

        {currentTab === "deleteAccount" && isProduction && <DeleteAccount />}
      </PageContainer>
    </div>
  );
};

export default SettingsPage;
