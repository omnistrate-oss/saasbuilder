import { useQuery } from "@tanstack/react-query";
import { getSubscriptions } from "src/api/subscriptions";

const useSubscriptions = (queryOptions = {}) => {
  const subscriptionData = useQuery({
    queryKey: ["user-subscriptions"],
    queryFn: () => getSubscriptions(),
    select: (response) => response.data.subscriptions,
    ...queryOptions,
  });

  return subscriptionData;
};

export default useSubscriptions;
