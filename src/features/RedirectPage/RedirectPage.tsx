import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createSubscriptionRequest } from "src/api/subscriptionRequests";
import { createSubscriptions } from "src/api/subscriptions";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import {
  getMarketplaceProductTierRoute,
  getResourceRoute,
} from "src/utils/route/access/accessRoute";
import useOrgServiceOfferings from "../Marketplace/PublicServices/hooks/useOrgServiceOfferings";
import { Box } from "@mui/material";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import useSubscriptionRequests from "../Marketplace/MarketplaceProductTier/hooks/useSubscriptionRequests";
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";

const RedirectPage = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { data: serviceOfferingsData, isFetching: isFetchingServiceOfferings } =
    useOrgServiceOfferings({ refetchOnMount: false });

  const { data: subscriptions = [], isFetching: isFetchingSubscriptions } =
    useUserSubscriptions();

  const {
    data: subscriptionRequestsData,
    isFetching: isFetchingSubscriptionRequests,
  } = useSubscriptionRequests();

  const subscribeMutation = useMutation((payload: any) => {
    if (payload.createSubscription) {
      return createSubscriptions({
        serviceId: payload.serviceId,
        productTierId: payload.productTierId,
      });
    } else {
      return createSubscriptionRequest({
        serviceId: payload.serviceId,
        productTierId: payload.productTierId,
      });
    }
  });

  useEffect(() => {
    if (
      isFetchingServiceOfferings ||
      isFetchingSubscriptionRequests ||
      isFetchingSubscriptions ||
      isRedirecting ||
      subscribeMutation.isLoading
    )
      return;

    const subscriptionRequestIds = subscriptionRequestsData?.ids;

    // No Subscriptions, Subscribe to the First Service Offering
    if (subscriptions?.length === 0 && subscriptionRequestIds?.length === 0) {
      let offering = serviceOfferingsData?.find(
        (offering) =>
          offering.AutoApproveSubscription &&
          (offering.productTierName.toLowerCase().includes("free") ||
            offering.productTierPlanDescription.toLowerCase().includes("free"))
      ); // Find the First Service Offering with AutoApproveSubscription Enabled and Free Plan

      if (!offering) {
        offering = serviceOfferingsData?.find(
          (offering) => offering.AutoApproveSubscription
        ); // Find the First Service Offering with AutoApproveSubscription Enabled
      }

      if (!offering) {
        setIsRedirecting(true);
        router.push("/service-plans");
        return;
      }

      subscribeMutation.mutate(
        {
          productTierId: offering.productTierID,
          serviceId: offering.serviceId,
          createSubscription: offering.AutoApproveSubscription,
        },
        {
          onSuccess: (res: any) => {
            setIsRedirecting(true);
            if (offering.AutoApproveSubscription) {
              router.push(
                getResourceRoute(
                  offering.serviceId,
                  offering.serviceEnvironmentID,
                  offering.productTierID,
                  Object.values(res.data).join("") // The Subscription ID
                )
              );
            } else {
              router.push(
                getMarketplaceProductTierRoute(
                  offering.serviceId,
                  offering.serviceEnvironmentID
                )
              );
            }
          },
        }
      );

      if (!isRedirecting) {
        setIsRedirecting(true);
        router.push("/service-plans");
      }

      return;
    }

    // Find Service Offering with a Subscription and Redirect them To the Corresponding Instances List Page
    const serviceOfferingsObj = serviceOfferingsData?.reduce(
      (acc, curr) => ({ ...acc, [curr.productTierID]: curr }),
      {}
    );

    const directSubscription = subscriptions?.find(
      (sub) => serviceOfferingsObj[sub.productTierId] && sub.defaultSubscription
    );

    const invitedSubscription = subscriptions?.find(
      (sub) => serviceOfferingsObj[sub.productTierId]
    );

    if (directSubscription || invitedSubscription) {
      const subscription = directSubscription || invitedSubscription;
      const offering = serviceOfferingsObj[subscription.productTierId];
      const route = getResourceRoute(
        subscription.serviceId,
        offering.serviceEnvironmentID,
        subscription.productTierId,
        subscription.id
      );
      setIsRedirecting(true);
      router.push(route);
    } else {
      setIsRedirecting(true);
      router.push("/service-plans");
    }
  }, [
    isFetchingSubscriptions,
    isFetchingServiceOfferings,
    isFetchingSubscriptionRequests,
    serviceOfferingsData,
    subscriptionRequestsData,
    subscriptions,
    isRedirecting,
  ]);

  return (
    <DashboardLayout accessPage customLogo SidebarUI={""}>
      <Box display="flex" justifyContent="center" mt="50px">
        <LoadingSpinner />
      </Box>
    </DashboardLayout>
  );
};

export default RedirectPage;
