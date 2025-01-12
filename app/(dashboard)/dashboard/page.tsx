"use client";

import PageTitle from "../components/Layout/PageTitle";
import DashboardIcon from "../components/Icons/DashboardIcon";
import PageContainer from "../components/Layout/PageContainer";
import ClusterLocations from "src/features/Access/Dashboard/ClusterLocations";

import useInstances from "../instances/hooks/useInstances";

const DashboardPage = () => {
  const { data: instances = [], isLoading: isLoadingInstances } =
    useInstances();

  return (
    <PageContainer>
      <PageTitle icon={DashboardIcon} className="mb-6">
        Dashboard
      </PageTitle>

      <ClusterLocations
        resourceInstances={instances}
        isFetchingInstances={isLoadingInstances}
      />
    </PageContainer>
  );
};

export default DashboardPage;
