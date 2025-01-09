import { useQuery } from "@tanstack/react-query";
// import { getAllSubscriptionUsers } from "src/api/users";

const useAllUsers = (queryOptions = {}) => {
  const instancesQuery = useQuery(
    ["users"],
    async () => {
      // return getAllSubscriptionUsers()
      return {
        subscriptionUsers: [],
      };
    },
    {
      select: (data) => {
        return data.subscriptionUsers;
      },
      ...queryOptions,
    }
  );
  return instancesQuery;
};

export default useAllUsers;
