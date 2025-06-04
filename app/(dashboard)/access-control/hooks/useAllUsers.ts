import { $api } from "src/api/query";
import useEnvironmentType from "src/hooks/useEnvironmentType";

const useAllUsers = (queryOptions = {}) => {
  const query = $api.useQuery(
    "get",
    "/2022-09-01-00/resource-instance/subscription-users",
    {
      params: {
        query: {
          environmentType: useEnvironmentType(),
        },
      },
    },
    {
      select: (data) => data.subscriptionUsers,
      ...queryOptions,
    }
  );

  return query;
};

export default useAllUsers;
