import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectUserData } from "../../slices/userDataSlice";
import { getSubscription, getSubscriptionIds } from "../../api/subscriptions";

function useSubscription(productTierId) {
  const userData = useSelector(selectUserData);
  const orgId = userData[0]?.orgId;
  const isQueryEnabled = Boolean(orgId && productTierId);
  const query = useQuery(
    ["subscriptions", orgId, productTierId],
    async () => {
      const subIds = await getSubscriptionIds(orgId);
      const subscriptionData = [];
      await Promise.all(
        subIds.data.ids.map((subId) => {
          return getSubscription(subId).then((response) => {
            const subData = response.data;
            return subscriptionData.push(subData);
          });
        })
      );
      const subscription = subscriptionData.find(
        (s) => s.productTierId === productTierId
      );
      return subscription;
    },
    {
      enabled: isQueryEnabled,
      retry: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      select: (response) => {
        return response;
      },
    }
  );
  return query;
}

export default useSubscription;
