import { useQuery } from "@tanstack/react-query";
import { getAllResourceInstances } from "src/api/resourceInstance";
import useEnvironmentType from "src/hooks/useEnvironmentType";

const useInstances = (queryOptions = {}) => {
  const environmentType = useEnvironmentType();

  const instancesQuery = useQuery(
    ["instances"],
    async () => {
      return getAllResourceInstances({
        environmentType,
      });
    },
    {
      select: (data) => {
        return data.data.resourceInstances.sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
        );
      },
      refetchInterval: 60000,
      ...queryOptions,
    }
  );
  return instancesQuery;
};

export default useInstances;
