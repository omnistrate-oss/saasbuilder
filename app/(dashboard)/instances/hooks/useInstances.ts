import { useQuery } from "@tanstack/react-query";
import { getAllResourceInstances } from "src/api/resourceInstance";

const useInstances = (queryOptions = {}) => {
  const instancesQuery = useQuery(
    ["instances"],
    async () => {
      return getAllResourceInstances();
    },
    {
      select: (data) => {
        return data.data.resourceInstances;
      },
      refetchInterval: 60000,
      ...queryOptions,
    }
  );
  return instancesQuery;
};

export default useInstances;
