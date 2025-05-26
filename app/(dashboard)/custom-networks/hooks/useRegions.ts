import { useQuery } from "@tanstack/react-query";

import { getCloudProviders } from "src/api/cloudProvider";
import { getRegionById, getRegions } from "src/api/region";

const useRegions = (queryOptions = {}) => {
  const regionsQuery = useQuery({
    queryKey: ["cloud-regions"],
    queryFn: async () => {
      const cloudProvidersRes = await getCloudProviders();
      const cloudProviders: string[] = cloudProvidersRes?.data?.map((cloudProvider) => cloudProvider?.name);
      const res: any[] = [];

      const regionIds: string[] = [];

      await Promise.all(
        cloudProviders?.map((cloud) =>
          getRegions(cloud).then((regionsRes) => {
            if (regionsRes.data.ids?.length) regionIds.push(...regionsRes.data.ids);
          })
        )
      );

      await Promise.all(
        regionIds.map((regionId) => {
          return getRegionById(regionId).then((response) => {
            res.push(response.data);
          });
        })
      );

      return res;
    },
    refetchOnMount: false,
    ...queryOptions,
  });
  return regionsQuery;
};

export default useRegions;
