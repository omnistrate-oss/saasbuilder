import React, { Fragment, useState } from "react";
import Carousel from "react-material-ui-carousel";
import MultiProductTierPlanCard from "./MultiProductTierPlanCard";
import { Box } from "@mui/material";
import _ from "lodash";

const CarouselMultiProductTierPlan = (props) => {
  const {
    serviceOfferingData,
    serviceId,
    subscriptionsData,
    selectedProductTierId,
    setSelectedProductTierId,
    source,
    isUserFromServiceOrg,
    subscribeMutation,
    unSubscribeMutation,
    handleNavigateToDashboard,
    handleDeleteDialogOpen,
    subscriptionRequests,
    cancelSubscriptionRequestMutation,
  } = props;
  const data = serviceOfferingData?.offerings || [];
  const sliderItems = data.length > 3 ? 3 : data.length;
  const items = [];
  //used to force rerender carousel component
  //disabling eslint to block incorrect error report - https://github.com/facebook/react/issues/31687
  //eslint-disable-next-line 
  const [carouselKey, setCarouselKey] = useState(0);

  function reRenderCarousel() {
    setCarouselKey(_.random(1, 10000,));
  }

  for (let i = 0; i < data.length; i += sliderItems) {
    if (i % sliderItems === 0) {
      items.push(
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            marginRight: "auto",
            marginLeft: "auto",
            justifyContent: "center",
            minHeight: "250px",
          }}
        >
          {data.slice(i, i + sliderItems).map((offering, index) => {
            return (
              <Fragment key={index}>
                <MultiProductTierPlanCard
                  offering={offering}
                  serviceId={serviceId}
                  subscriptionsData={subscriptionsData}
                  selectedProductTierId={selectedProductTierId}
                  setSelectedProductTierId={setSelectedProductTierId}
                  source={source}
                  isUserFromServiceOrg={isUserFromServiceOrg}
                  subscribeMutation={subscribeMutation}
                  unSubscribeMutation={unSubscribeMutation}
                  handleNavigateToDashboard={handleNavigateToDashboard}
                  handleUnsubscribeClick={handleDeleteDialogOpen}
                  isMarketplacePage={true}
                  subscriptionRequests={subscriptionRequests}
                  cancelSubscriptionRequestMutation={
                    cancelSubscriptionRequestMutation
                  }
                  reRenderCarousel={reRenderCarousel}
                />
              </Fragment>
            );
          })}
        </Box>
      );
    }
  }

  return (
    <Carousel
      animation="slide"
      autoPlay={false}
      cycleNavigation
      timeout={300}
      sx={{ justifyContent: "center" }}
      key={carouselKey}
      swipe={false}
    >
      {items}
    </Carousel>
  );
};

export default CarouselMultiProductTierPlan;
