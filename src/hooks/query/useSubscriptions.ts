import { useQuery } from "@tanstack/react-query";
import useEnvironmentType from "../useEnvironmentType";

import { getSubscriptions } from "src/api/subscriptions";

const useSubscriptions = (queryOptions = {}) => {
  const environmentType = useEnvironmentType();
  const subscriptionData = useQuery(
    ["user-subscriptions", environmentType],
    () => {
      return getSubscriptions({
        environmentType,
      });
    },
    {
      select: (data) => {
        return data.data.subscriptions;
      },
      ...queryOptions,
    }
  );

  return subscriptionData;
};

export default useSubscriptions;
