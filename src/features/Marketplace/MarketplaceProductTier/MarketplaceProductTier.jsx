import { Box, Divider, Typography, styled } from "@mui/material";
import { useRouter } from "next/router";
import useServiceOfferingById from "./hooks/useServiceOfferingById";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import ProductTiers from "src/features/ProductTiers/ProductTiers";
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";
import useProductTierRedirect from "./hooks/useProductTierRedirect";
import NoServiceFoundUI from "../components/NoServiceFoundUI";
import useSubscriptionRequests from "./hooks/useSubscriptionRequests";
import { useMemo } from "react";
import { useOrgDetails } from "src/context/OrgDetailsProvider";

function MarketplaceProductTier() {
  const router = useRouter();
  const { serviceId, environmentId } = router.query;
  const { orgLogoURL, orgName } = useOrgDetails();
  const serviceOfferingQuery = useServiceOfferingById(serviceId);
  const { data, isFetching } = serviceOfferingQuery;
  const serviceOfferingData = useMemo(() => {
    return {
      ...data,
      offerings: data?.offerings?.sort((a, b) =>
        a.productTierName < b.productTierName ? -1 : 1
      ),
    };
  }, [data]);
  const subscriptionsQuery = useUserSubscriptions({ serviceId });
  const {
    data: subscriptionRequests = [],
    isLoading: isSubscriptionRequestLoading,
    refetch: refetchSubscriptionRequests,
  } = useSubscriptionRequests();
  const { shouldDisplayNoServicesUI, shouldDisplayServiceNotFoundUI } =
    useProductTierRedirect();

  const {
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscriptions,
    data: subscriptions = [],
  } = subscriptionsQuery;

  if (shouldDisplayServiceNotFoundUI || shouldDisplayNoServicesUI) {
    return (
      <>
        <NoServiceFoundUI
          text={
            shouldDisplayNoServicesUI ? "No service found" : "Service not found"
          }
        />
      </>
    );
  }

  return (
    <>
      {!serviceId ||
      !environmentId ||
      isFetching ||
      isSubscriptionLoading ||
      isSubscriptionRequestLoading ? (
        <Box display="flex" justifyContent="center" mt="200px">
          <LoadingSpinner />
        </Box>
      ) : (
        <>
          <Title>{serviceOfferingData?.serviceName}</Title>
          <Divider />
          <Box mt="40px">
            <ProductTiers
              source="marketplace"
              serviceId={serviceId}
              environmentId={environmentId}
              serviceOfferingData={serviceOfferingData}
              subscriptionsData={subscriptions}
              refetchSubscriptions={refetchSubscriptions}
              subscriptionRequests={subscriptionRequests}
              refetchSubscriptionRequests={refetchSubscriptionRequests}
            />
          </Box>
        </>
      )}
    </>
  );
}

export default MarketplaceProductTier;

export const Title = styled(Typography)(() => ({
  color: "#101828",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "32px",
  marginBottom: "10px",
}));
