import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import { useRouter } from "next/router";
import useServiceOffering from "src/hooks/useServiceOffering";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import Statistics from "src/components/MarketplaceDashboard/Statistics";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOfferingResourceInstances from "src/hooks/useServiceOfferingResourceInstances";
import SideDrawerRight from "src/components/SideDrawerRight/SideDrawerRight";
import { AccessSupport } from "src/components/Access/AccessSupport";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
} from "src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import { OfferingUnavailableUI } from "pages/access/service/[serviceId]";
import useServiceHealth from "src/hooks/query/useServiceHealth";
import ClusterLocations from "src/features/Access/Dashboard/ClusterLocations";
import LogoHeader from "src/components/Headers/LogoHeader";
import DashboardHeaderIcon from "src/components/Icons/Dashboard/DashboardHeaderIcon";
import { Box } from "@mui/material";
import Divider from "src/components/Divider/Divider";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

function Dashboard() {
  const router = useRouter();
  const { serviceId, environmentId, source, productTierId, subscriptionId } =
    router.query;

  const { data: serviceOffering, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [currentSource, setCurrentSource] = React.useState("");

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionQuery;

  const serviceHealthQuery = useServiceHealth();

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };
  const {
    isLoading: isResourceInstancesLoading,
    numResourceInstances,
    isIdle: isResourceInstancesIdle,
    resourceInstances = [],
  } = useServiceOfferingResourceInstances(
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

  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);

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

  const isLoading =
    isServiceOfferingLoading ||
    isResourceInstancesLoading ||
    isResourceInstancesIdle;

  if (isLoading || isLoadingSubscription) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        customLogo
        serviceId={serviceId}
        currentSubscription={subscriptionData}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={serviceOffering?.serviceName}
            productTierId={productTierId}
            active={sidebarActiveOptions.dashboard}
            currentSource={currentSource}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={serviceOffering?.serviceName}
        serviceLogoURL={serviceOffering?.serviceLogoURL}
        pageType={sidebarActiveOptions.dashboard}
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
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        customLogo
        serviceId={serviceId}
        currentSubscription={subscriptionData}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={serviceOffering?.serviceName}
            productTierId={productTierId}
            active={sidebarActiveOptions.dashboard}
            currentSource={currentSource}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={serviceOffering?.serviceName}
        serviceLogoURL={serviceOffering?.serviceLogoURL}
        pageType={sidebarActiveOptions.dashboard}
      >
        <SubscriptionNotFoundUI />
      </DashboardLayout>
    );
  }

  const servicePlanUrlLink = getMarketplaceRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource
  );

  const serviceAPIDocsLink = getAPIDocsRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource,
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
        pageType={sidebarActiveOptions.dashboard}
      >
        <OfferingUnavailableUI />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      setSupportDrawerOpen={setSupportDrawerOpen}
      setCurrentTabValue={setCurrentTabValue}
      marketplacePage={currentSource === "access" ? false : true}
      accessPage
      currentSubscription={subscriptionData}
      apiDocsurl={serviceAPIDocsLink}
      enableConsumptionLinks
      servicePlanUrlLink={servicePlanUrlLink}
      serviceId={serviceId}
      serviceApiId={serviceOffering?.serviceAPIID}
      SidebarUI={
        <MarketplaceServiceSidebar
          serviceId={serviceId}
          environmentId={environmentId}
          resourceParameters={serviceOffering?.resourceParameters}
          isLoading={isServiceOfferingLoading}
          serviceName={serviceOffering?.serviceName}
          productTierId={productTierId}
          active={sidebarActiveOptions.dashboard}
          currentSource={currentSource}
          currentSubscription={subscriptionData}
          isCustomNetworkEnabled={isCustomNetworkEnabled}
        />
      }
      serviceName={serviceOffering?.serviceName}
      customLogo
      serviceLogoURL={serviceOffering?.serviceLogoURL}
      pageType={sidebarActiveOptions.dashboard}
    >
      <Box
        display="flex"
        //@ts-ignore
        flexDirection="colunm"
        justifyContent="flex-start"
        paddingBottom={"32px"}
      >
        <Box paddingTop={"5px"}>
          <DashboardHeaderIcon />
        </Box>
        <LogoHeader margin={0} title={"Dashboard"} desc="" />
      </Box>
      <Divider />

      <Statistics
        serviceHealthQuery={serviceHealthQuery}
        numResourceInstances={numResourceInstances}
        numResources={serviceOffering?.resourceParameters.length}
      />
      <ClusterLocations
        resourceInstances={resourceInstances}
        isFetchingInstances={isResourceInstancesLoading}
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

export default Dashboard;
