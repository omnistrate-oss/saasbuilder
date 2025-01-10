import { useQuery } from "@tanstack/react-query";
// import { getAllSubscriptionUsers } from "src/api/users";

const useAllUsers = (queryOptions = {}) => {
  const instancesQuery = useQuery(
    ["users"],
    async () => {
      // return getAllSubscriptionUsers()
      return {
        subscriptionUsers: [
          {
            subscriptionId: "sub-NC3EXppUx7",
            userId: "user-UsPpN9SXBm",
            name: "Unregistered user",
            email: "nihalm+abcd@omnistrate.com",
            roleType: "editor",
          },
        ],
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
