import { useQuery } from "@tanstack/react-query";

import { getAllSubscriptionUsers } from "src/api/users";
import useEnvironmentType from "src/hooks/useEnvironmentType";

const useAllUsers = (queryOptions = {}) => {
  const environmentType = useEnvironmentType();

  const instancesQuery = useQuery(
    ["users", environmentType],
    async () => {
      return getAllSubscriptionUsers({
        environmentType,
      });
    },
    {
      select: (data) => {
        return data.data.subscriptionUsers;
      },
      ...queryOptions,
    }
  );
  return instancesQuery;
};

export default useAllUsers;
