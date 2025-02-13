"use client";

import PageTitle from "../components/Layout/PageTitle";
import DashboardIcon from "../components/Icons/DashboardIcon";
import PageContainer from "../components/Layout/PageContainer";
import ClusterLocations from "src/features/Access/Dashboard/ClusterLocations";

import useInstances from "../instances/hooks/useInstances";
import DashboardLogsTableHeader from "./components/DashboardLogsTableHeader";
import EventsTable from "../components/EventsTable/EventsTable";
import useAuditLogs from "../audit-logs/hooks/useAuditLogs";
import { useGlobalData } from "src/providers/GlobalDataProvider";
// import ChartCard from "./components/ChartCard";
// import LifecycleStatusChart from "./charts/LifecycleStatusChart";
// import DeploymentsByLoad from "./charts/DeploymentsByLoadChart";
// import CloudProvidersChart from "./charts/CloudProvidersChart";

const DashboardPage = () => {
  const { data: instances = [], isLoading: isLoadingInstances } =
    useInstances();
  const { isFetchingSubscriptions } = useGlobalData();

  const { data: dashboardLogs, isFetching: isFetchingDashboardLogs } =
    useAuditLogs({
      pageSize: 5,
      eventSourceTypes: "Customer",
    });

  return (
    <PageContainer>
      <PageTitle icon={DashboardIcon} className="mb-6">
        Dashboard
      </PageTitle>

      <ClusterLocations
        resourceInstances={instances}
        isFetchingInstances={isLoadingInstances}
      />

      <div className="mt-8">
        <EventsTable
          HeaderComponent={DashboardLogsTableHeader}
          HeaderProps={{}}
          columns={[
            "expand",
            "deploymentId",
            "serviceName",
            "resourceType",
            "time",
            "message",
            "user",
            "subscriptionPlan",
            "subscriptionOwner",
          ]}
          data={dashboardLogs}
          fetchNextPage={() => {}}
          hasNextPage={false}
          isFetchingNextPage={false}
          isLoading={isFetchingDashboardLogs || isFetchingSubscriptions}
          pageIndex={0}
          setPageIndex={() => {}}
          showPagination={false}
          minHeight={290}
          noRowsText="No audit logs"
        />
      </div>

      {/* <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <ChartCard title="Lifecycle Status Breakdown" className="lg:col-span-2">
          <LifecycleStatusChart instances={instances} />
        </ChartCard>

        <ChartCard title="Health Status Breakdown">Hello World!</ChartCard>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <ChartCard title="Deployments By Load">
          <DeploymentsByLoad instances={instances} />
        </ChartCard>

        <ChartCard title="Deployments By Cloud">
          <CloudProvidersChart instances={instances} />
        </ChartCard>
      </div> */}
    </PageContainer>
  );
};

export default DashboardPage;
