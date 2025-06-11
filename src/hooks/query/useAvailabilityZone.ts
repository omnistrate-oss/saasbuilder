import { $api } from "src/api/query";
import { CloudProvider } from "src/types/common/enums";

type QueryParams = {
  regionCode: string;
  cloudProviderName: CloudProvider;
  hasCustomAvailabilityZoneField?: boolean;
};

const useAvailabilityZone = (queryParams: QueryParams, queryOptions = {}) => {
  const { regionCode, cloudProviderName, hasCustomAvailabilityZoneField = true } = queryParams;
  const isEnabled = Boolean(regionCode && cloudProviderName && hasCustomAvailabilityZoneField);

  const query = $api.useQuery(
    "get",
    "/2022-09-01-00/availability-zone/region/code/{regionCode}/cloud-provider/{cloudProviderName}",
    {
      params: {
        path: {
          regionCode,
          cloudProviderName,
        },
      },
    },
    {
      enabled: isEnabled,
      ...queryOptions,
    }
  );

  return query;
};

export default useAvailabilityZone;
