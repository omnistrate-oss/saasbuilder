import React, { useMemo, useState } from "react";
import DashboardLayout from "../../../../src/components/DashboardLayout/DashboardLayout";

import EventsTable from "../../../../src/components/EventsTable/EventsTable";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "../../../../src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOfferingEvents from "../../../../src/hooks/useServiceOfferingEvents";
import { selectEvents } from "../../../../src/slices/eventsSlice";
import LoadingSpinner from "../../../../src/components/LoadingSpinner/LoadingSpinner";
import useServiceOffering from "../../../../src/hooks/useServiceOffering";

import SideDrawerRight from "../../../../src/components/SideDrawerRight/SideDrawerRight";
import { AccessSupport } from "../../../../src/components/Access/AccessSupport";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
} from "../../../../src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import { OfferingUnavailableUI } from "pages/access/service/[serviceId]";
import { AccessEvent } from "src/types/event";
import { Box } from "@mui/material";
import LogoHeader from "src/components/Headers/LogoHeader";
import AuditLogsIcon from "src/components/Icons/AuditLogsIcon/AuditLogsIcon";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

function Events() {
  const router = useRouter();
  const { serviceId, environmentId, productTierId, subscriptionId } =
    router.query;

  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const { data: serviceOffering, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);
  const events: AccessEvent[] = useSelector(selectEvents);

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionQuery;

  //needs service id, serviceProviderId,service URL key, service API Version, service Environment URL Key, service Model URL key, product tier URL key, resourceParameters
  const eventsQuery = useServiceOfferingEvents(
    serviceId,
    serviceOffering?.serviceProviderId,
    serviceOffering?.serviceURLKey,
    serviceOffering?.serviceAPIVersion,
    serviceOffering?.serviceEnvironmentURLKey,
    serviceOffering?.serviceModelURLKey,
    serviceOffering?.productTierURLKey,
    serviceOffering?.resourceParameters,
    subscriptionData?.id
  );

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  const {
    isLoading: isEventsLoading,
    isRefetching: isEventsRefetching,
    refetch,
  } = eventsQuery;

  const isCustomNetworkEnabled = useMemo(() => {
    let enabled = false;

    if (
      serviceOffering?.serviceModelFeatures?.find((featureObj) => {
        return featureObj.feature === "CUSTOM_NETWORKS";
      })
    )
      enabled = true;

    return enabled;
  }, [serviceOffering]);

  const isRootSubscription = subscriptionData?.roleType === "root";

  const isLoading = isServiceOfferingLoading || isEventsLoading;

  // const nonMaintenanceEvents = events.filter(
  //   (event) => event.eventSource !== "Maintenance"
  // );

  const customerEvents = useMemo(
    () => events?.filter((event) => event.eventSource === "Customer") ?? [],
    [events]
  );

  if (isLoading || isLoadingSubscription) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        accessPage
        customLogo
        serviceId={serviceId}
        environmentId={environmentId}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            productTierId={productTierId}
            serviceName={serviceOffering?.serviceName}
            active={sidebarActiveOptions.auditLogs}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={serviceOffering?.serviceName}
        serviceLogoURL={serviceOffering?.serviceLogoURL}
        pageType={sidebarActiveOptions.auditLogs}
      >
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!isLoadingSubscription && !subscriptionData?.id) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        accessPage
        customLogo
        serviceId={serviceId}
        environmentId={environmentId}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            productTierId={productTierId}
            serviceName={serviceOffering?.serviceName}
            active={sidebarActiveOptions.auditLogs}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={serviceOffering?.serviceName}
        serviceLogoURL={serviceOffering?.serviceLogoURL}
        pageType={sidebarActiveOptions.auditLogs}
      >
        <SubscriptionNotFoundUI />
      </DashboardLayout>
    );
  }
  const servicePlanUrlLink = getMarketplaceRoute(
    serviceId,
    environmentId,
    productTierId
  );

  const serviceAPIDocsLink = getAPIDocsRoute(
    serviceId,
    environmentId,
    productTierId,
    subscriptionData?.id
  );

  //handle the case of when someone tries to access the service w/o releasing
  if (
    serviceOffering?.notAvailable ||
    serviceOffering?.serviceModelStatus === "DEPLOYING"
  ) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        serviceId={serviceId}
        serviceApiId={serviceOffering?.serviceAPIID}
        marketplacePage
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        accessPage
        currentSubscription={subscriptionData}
        environmentId={environmentId}
        pageType={sidebarActiveOptions.auditLogs}
      >
        <OfferingUnavailableUI />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      setSupportDrawerOpen={setSupportDrawerOpen}
      setCurrentTabValue={setCurrentTabValue}
      accessPage
      currentSubscription={subscriptionData}
      enableConsumptionLinks
      apiDocsurl={serviceAPIDocsLink}
      servicePlanUrlLink={servicePlanUrlLink}
      serviceId={serviceId}
      environmentId={environmentId}
      serviceApiId={serviceOffering?.serviceAPIID}
      SidebarUI={
        <MarketplaceServiceSidebar
          serviceId={serviceId}
          environmentId={environmentId}
          resourceParameters={serviceOffering?.resourceParameters}
          isLoading={isServiceOfferingLoading}
          serviceName={serviceOffering?.serviceName}
          productTierId={productTierId}
          active={sidebarActiveOptions.auditLogs}
          currentSubscription={subscriptionData}
          isCustomNetworkEnabled={isCustomNetworkEnabled}
        />
      }
      serviceName={serviceOffering?.serviceName}
      customLogo
      serviceLogoURL={serviceOffering?.serviceLogoURL}
      pageType={sidebarActiveOptions.auditLogs}
    >
      <Box
        display="flex"
        //@ts-ignore
        justifyContent="flex-start"
        paddingBottom={"32px"}
      >
        <Box paddingTop={"5px"}>
          <AuditLogsIcon />
        </Box>
        <LogoHeader margin={0} title={"Audit Logs"} desc="" />
      </Box>

      <EventsTable
        serviceId={serviceId as string}
        environmentId={environmentId as string}
        productTierId={productTierId as string}
        subscriptionId={subscriptionData?.id}
        events={customerEvents}
        refetchEvents={refetch}
        isRefetching={isEventsRefetching}
        isRootSubscription={isRootSubscription}
        disableTypeFilter={true}
        hideTypeColumn={true}
        entityName="Audit Log"
        desc="Detailed audit trail of user actions performed on resource instances"
      />
      <SideDrawerRight
        size="xlarge"
        open={supportDrawerOpen}
        closeDrawer={closeSupportDrawer}
        RenderUI={
          <AccessSupport
            service={serviceOffering}
            currentTabValue={currentTabValue}
          />
        }
      />
    </DashboardLayout>
  );
}

export default Events;
