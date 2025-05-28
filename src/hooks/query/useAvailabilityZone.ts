import { useQuery } from "@tanstack/react-query";

import { getAvailabilityZone } from "src/api/availabilityZone";
import { CloudProvider } from "src/types/common/enums";

export default function useAvailabilityZone(
  regionCode?: string,
  cloudProviderName?: CloudProvider,
  hasCustomAvailabilityZoneField = true,
  queryOptions = {}
) {
  const isQueryEnabled = Boolean(regionCode && cloudProviderName && hasCustomAvailabilityZoneField);
  const query = useQuery({
    queryKey: ["cloud-providers-custom-regions", regionCode, cloudProviderName],
    queryFn: async () => {
      const response = await getAvailabilityZone(cloudProviderName!, regionCode!);

      return response;
    },
    enabled: isQueryEnabled,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    select: (response) => {
      return response.data;
    },
    ...queryOptions,
  });

  return query;
}
