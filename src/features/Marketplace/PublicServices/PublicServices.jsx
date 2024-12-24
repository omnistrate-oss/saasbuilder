import React, { Fragment } from "react";
import usePublicServiceOfferings from "./hooks/useOrgServiceOfferings";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import MarketplaceSidebar from "src/components/MarketplaceSidebar/MarketplaceSidebar";
import MarketplaceHeader from "src/components/Headers/MarketplaceHeader";
import { Box, styled } from "@mui/material";
import { getMarketplaceProductTierRoute } from "src/utils/route/access/accessRoute";
import ServiceCard from "../components/ServiceCard";
import { Text } from "src/components/Typography/Typography";
import { marketplaceServicePageTypes } from "../constants/marketplaceServicePageTypes";
import Head from "next/head";

function PublicServices() {
  const serviceOfferingsQuery = usePublicServiceOfferings();

  const {
    data: serviceOfferingsData,
    isLoading,
    isFetching,
  } = serviceOfferingsQuery;

  return (
    <>
      <Head>
        <title>Services</title>
      </Head>
      <DashboardLayout
        // noSidebar
        SidebarUI={<MarketplaceSidebar active={"all"} />}
        marketplacePage
      >
        {isFetching || isLoading ? (
          <Box display="flex" justifyContent="center" mt="200px">
            <LoadingSpinner />
          </Box>
        ) : (
          <>
            <MarketplaceHeader
              title="Services"
              desc={`Explore services`}
              count={serviceOfferingsData?.length}
              isLoading={isFetching}
            />
            {serviceOfferingsData?.length > 0 ? (
              <StyledGrid>
                {serviceOfferingsData?.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <ServiceCard
                        serviceData={item}
                        link={getMarketplaceProductTierRoute(
                          item?.serviceId,
                          item?.serviceEnvironmentID,
                          marketplaceServicePageTypes.public
                        )}
                      />
                    </Fragment>
                  );
                })}
              </StyledGrid>
            ) : (
              <Box
                sx={{ mt: "100px", display: "flex", justifyContent: "center" }}
              >
                <Text size="large" weight="medium">
                  No services available
                </Text>
              </Box>
            )}
          </>
        )}
      </DashboardLayout>
    </>
  );
}

export default PublicServices;

const StyledGrid = styled(Box)(() => ({
  marginTop: "20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(375px, 1fr))",
  rowGap: "20px",
  columnGap: "30px",
}));
