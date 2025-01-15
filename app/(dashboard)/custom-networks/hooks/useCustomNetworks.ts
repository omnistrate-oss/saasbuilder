import { useQuery } from "@tanstack/react-query";
import { getCustomNetworks } from "src/api/customNetworks";

function useCustomNetworks(queryOptions = {}) {
  const customNetworksQuery = useQuery({
    queryKey: ["cloud-provider"],
    queryFn: () => {
      return getCustomNetworks();
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
