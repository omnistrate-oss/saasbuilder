"use client";

import { useMemo } from "react";
import formatDateUTC from "src/utils/formatDateUTC";

import StatusChip from "components/StatusChip/StatusChip";
import DetailsTable from "components/DetailsTable/DetailsTable";
import ServiceNameWithLogo from "components/ServiceNameWithLogo/ServiceNameWithLogo";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import CardWithTitle from "src/components/Card/CardWithTitle";
import ServicePlanDetails from "src/components/ServicePlanDetails/ServicePlanDetails";

const SubscriptionDetails = ({ subscription, serviceOfferingsObj }) => {
  const columns = useMemo(
    () => [
      {
        title: "Service Name",
        content: (
          <ServiceNameWithLogo
            serviceName={subscription?.serviceName}
            serviceLogoURL={subscription?.serviceLogoURL}
          />
        ),
      },
      {
        title: "Role",
        content: subscription?.roleType
          ? subscription.roleType.charAt(0).toUpperCase() +
            subscription.roleType.slice(1)
          : "-",
      },
      {
        title: "Service Plan",
        content: subscription?.productTierName || "-",
      },
      {
        title: "Status",
        content: <StatusChip status={subscription?.status} />,
      },
      {
        title: "Subscription Date",
        content: subscription?.createdAt
          ? formatDateUTC(subscription.createdAt)
          : "-",
      },
      {
        title: "Subscription Owner",
        content: (
          <GridCellExpand
            value={subscription?.subscriptionOwnerName}
            startIcon={
              subscription?.roleType === "root" ? (
                <SubscriptionTypeDirectIcon />
              ) : (
                <SubscriptionTypeInvitedIcon />
              )
            }
          />
        ),
      },
    ],
    [subscription]
  );

  if (!subscription) return null;
  const selectedPlan =
    serviceOfferingsObj[subscription.serviceId]?.[subscription.productTierId];

  return (
    <>
      <DetailsTable columns={columns} />
      <CardWithTitle title={subscription.productTierName} className="mt-6">
        <ServicePlanDetails
          planDetails={selectedPlan?.productTierPlanDescription}
          documentation={selectedPlan?.productTierDocumentation}
          pricing={selectedPlan?.productTierPricing.value}
          support={selectedPlan?.productTierSupport}
        />
      </CardWithTitle>
    </>
  );
};

export default SubscriptionDetails;
