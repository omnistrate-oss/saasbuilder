"use client";

import NotificationsIcon from "../components/Icons/NotificationsIcon";
import PageContainer from "../components/Layout/PageContainer";
import PageTitle from "../components/Layout/PageTitle";

import NotificationsTable from "./components/NotificationsTable";

const NotificationsPage = () => {
  return (
    <PageContainer>
      <PageTitle icon={NotificationsIcon} className="mb-6">
        Alerts
      </PageTitle>

      <div>
        <NotificationsTable />
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;
