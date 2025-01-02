"use client";

import { selectUserrootData } from "src/slices/userDataSlice";
import AccountManagementHeader from "../components/AccountManagement/AccountManagementHeader";
import SettingsIcon from "../components/Icons/SettingsIcon";
import PageTitle from "../components/Layout/PageTitle";
import { useSelector } from "react-redux";
import PageContainer from "../components/Layout/PageContainer";

const BillingPage = () => {
  const selectUser = useSelector(selectUserrootData);

  return (
    <div>
      <AccountManagementHeader
        userName={selectUser?.name}
        userEmail={selectUser?.email}
      />
      <PageContainer>
        <PageTitle icon={SettingsIcon} className="mb-6">
          Billing
        </PageTitle>
      </PageContainer>
    </div>
  );
};

export default BillingPage;
