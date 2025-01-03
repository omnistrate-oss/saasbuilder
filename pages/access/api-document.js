import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import apiDocsIcon from "../../public/assets/images/marketplace/APIDocs.svg";
import DashboardLayout from "../../src/components/DashboardLayout/DashboardLayout";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "../../src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import { DisplayText } from "../../src/components/Typography/Typography";
import useServiceApiDocsData from "../../src/hooks/useServiceApiDocsData";
import useServiceOffering from "../../src/hooks/useServiceOffering";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import Image from "../../src/components/Image/Image";
import SideDrawerRight from "../../src/components/SideDrawerRight/SideDrawerRight";
import { AccessSupport } from "../../src/components/Access/AccessSupport";
import { getAPIDocsRoute } from "../../src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";

const SwaggerDocs = dynamic(
  () => import("../../src/components/SwaggerDocs/SwaggerDocs"),
  {
    ssr: false,
  }
);

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function ApiDocument() {
  const router = useRouter();
  const { serviceId, environmentId, source, productTierId, subscriptionId } =
    router.query;
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [currentSource, setCurrentSource] = React.useState("");
  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);
  const { data: serviceOffering } = useServiceOffering(
    serviceId,
    productTierId
  );

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  const subscriptionForAccessQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );

  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionForAccessQuery;

  const serviceApiSpecData = useServiceApiDocsData(
    serviceId,
    serviceOffering?.serviceAPIID,
    subscriptionData?.id
  );

  const isLoading = serviceApiSpecData.isLoading || serviceApiSpecData.isIdle;

  const serviceAPIDocsLink = getAPIDocsRoute(
    serviceId,
    environmentId,
    productTierId,
    subscriptionId || subscriptionData?.id
  );

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

  return (
    <>
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        currentSubscription={subscriptionData}
        serviceId={serviceId}
        serviceApiId={serviceOffering?.serviceAPIID}
        enableConsumptionLinks
        apiDocsurl={serviceAPIDocsLink}
        isActive
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={false}
            environmentId={environmentId}
            serviceName={serviceOffering?.serviceName}
            active={sidebarActiveOptions.apiDocument}
            productTierId={productTierId}
            currentSource={currentSource}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={serviceOffering?.serviceName}
        customLogo
        serviceLogoURL={serviceOffering?.serviceLogoURL}
        pageType={sidebarActiveOptions.apiDocument}
      >
        {isLoading || isLoadingSubscription ? (
          <LoadingSpinner />
        ) : !isLoadingSubscription && !subscriptionData?.id ? (
          <SubscriptionNotFoundUI />
        ) : (
          <>
            <Box sx={{ marginTop: "17px" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                mt="24px"
                sx={{
                  borderBottom: "2px solid #EAECF0",
                  paddingBottom: "20px",
                }}
              >
                <Image src={apiDocsIcon} alt="image-icon" />
                <Box flexGrow={1} ml="14px">
                  <DisplayText size="small" weight="semibold">
                    API Documentation
                  </DisplayText>
                </Box>
              </Box>
              <Box>
                <SwaggerDocs data={serviceApiSpecData.data} />
              </Box>
            </Box>
          </>
        )}

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
    </>
  );
}
