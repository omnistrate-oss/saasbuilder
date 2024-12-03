import React from "react";
import { selectUserrootData } from "src/slices/userDataSlice";
import useUserData from "src/hooks/usersData";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import PasswordForm from "./components/PasswordForm";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import UserInfoBanner from "./components/UserInfoBanner";
import ProfileForm from "./components/ProfileForm";
import { tabs } from "./constants";
import BillingAddress from "./components/BillingAddress";
import { Box } from "@mui/material";
import MySubscriptions from "../Marketplace/MySubscriptions";

function SettingsMarketplace() {
  const router = useRouter();
  const selectUser = useSelector(selectUserrootData);
  const { query, refetch } = useUserData();
  const [currentTab, setCurrentTab] = React.useState(tabs.profile);
  const isLoading = query.isRefetching === true || query.isLoading === true;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <UserInfoBanner
            selectUser={selectUser}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            router={router}
          />
          <Box >
            {currentTab === tabs.profile && (
              <ProfileForm refetch={refetch} selectUser={selectUser} />
            )}
            {currentTab === tabs.password && <PasswordForm />}
            {currentTab === tabs.billingAddress && (
              <BillingAddress refetch={refetch} selectUser={selectUser} />
            )}
            {currentTab === tabs.subscriptions && <MySubscriptions />}
          </Box>
        </>
      )}
    </>
  );
}

export default SettingsMarketplace;
