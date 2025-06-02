import { $api } from "src/api/query";

const useCustomNetworks = (queryOptions = {}) => {
  const query = $api.useQuery(
    "get",
    "/2022-09-01-00/resource-instance/custom-network",
    {},
    {
      select: (data) => data.customNetworks,
      refetchInterval: 60000,
      ...queryOptions,
    }
  );
  return query;
};

export default useCustomNetworks;
