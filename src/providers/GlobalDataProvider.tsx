"use client";

import { createContext, useContext, useMemo } from "react";
import NoServiceFoundUI from "app/(dashboard)/components/NoServiceFoundUI/NoServiceFoundUI";

import useSubscriptions from "src/hooks/query/useSubscriptions";
import useOrgServiceOfferings from "src/features/Marketplace/PublicServices/hooks/useOrgServiceOfferings";
import useSubscriptionRequests from "src/features/Marketplace/MarketplaceProductTier/hooks/useSubscriptionRequests";

export const GlobalDataContext: any = createContext(null); // TODO: Add a Type Here

export const useGlobalData = () => {
  const context: any = useContext(GlobalDataContext); // TODO: Add a Type Here

  if (context === undefined) {
    throw new Error(
      "useProviderOrgDetails must be used within a ProviderOrgDetailsProvider"
    );
  }

  return context || {};
};

const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: subscriptions = [],
    isLoading: isLoadingSubscriptions,
    isFetching: isFetchingSubscriptions,
    refetch: refetchSubscriptions,
  } = useSubscriptions();

  const {
    data: subscriptionRequests = [],
    isLoading: isLoadingSubscriptionRequests,
    isFetching: isFetchingSubscriptionRequests,
    refetch: refetchSubscriptionRequests,
  } = useSubscriptionRequests();

  const {
    data: serviceOfferings = [],
    isLoading: isLoadingServiceOfferings,
    isFetching: isFetchingServiceOfferings,
    refetch: refetchServiceOfferings,
  } = useOrgServiceOfferings();

  const serviceOfferingsObj = useMemo(() => {
    return serviceOfferings.reduce((acc: any, offering: any) => {
      if (acc[offering.serviceId]) {
        acc[offering.serviceId][offering.productTierID] = offering;
      } else {
        acc[offering.serviceId] = {
          [offering.productTierID]: offering,
        };
      }
      return acc;
    }, {});
  }, [serviceOfferings]);

  if (!isFetchingServiceOfferings && serviceOfferings.length === 0) {
    return <NoServiceFoundUI text="No Service Offerings Found" />;
  }

  return (
    <GlobalDataContext.Provider
      value={{
        subscriptions,
        isLoadingSubscriptions,
        isFetchingSubscriptions,
        refetchSubscriptions,

        subscriptionRequests,
        isLoadingSubscriptionRequests,
        isFetchingSubscriptionRequests,
        refetchSubscriptionRequests,

        serviceOfferings,
        isLoadingServiceOfferings,
        isFetchingServiceOfferings,
        refetchServiceOfferings,

        serviceOfferingsObj,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export default GlobalDataProvider;
