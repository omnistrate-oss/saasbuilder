import { useQuery } from "@tanstack/react-query";
import { getRegionById, getRegions } from "src/api/region";

const useRegions = (queryOptions = {}) => {
  const regionsQuery = useQuery(
    ["cloud-regions"],
    async () => {
      const res: any[] = [];
      const gcpRegions = getRegions("gcp");
      const awsRegions = getRegions("aws");

      const [gcpRegionsResponse, awsRegionsResponse] = await Promise.all([
        gcpRegions,
        awsRegions,
      ]);

      const regionIds = [
        ...gcpRegionsResponse.data.ids,
        ...awsRegionsResponse.data.ids,
      ];

      await Promise.all(
        regionIds.map((regionId) => {
          return getRegionById(regionId).then((response) => {
            res.push(response.data);
          });
        })
      );

      return res;
    },
    {
      refetchOnMount: false,
      ...queryOptions,
    }
  );
  return regionsQuery;
};

export default useRegions;
