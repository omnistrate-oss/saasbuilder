import { useQuery } from "@tanstack/react-query";

import { getCustomNetworks } from "src/api/customNetworks";
import useEnvironmentType from "src/hooks/useEnvironmentType";

function useCustomNetworks(queryOptions = {}) {
  const environmentType = useEnvironmentType();
  const customNetworksQuery = useQuery({
    queryKey: ["cloud-provider"],
    queryFn: () => {
      return getCustomNetworks({
        environmentType,
      });
    },
    select: (response) => {
      const customNetworks = response.data.customNetworks || [];
      return customNetworks;
    },
    ...queryOptions,
  });

  return customNetworksQuery;
}

export default useCustomNetworks;
