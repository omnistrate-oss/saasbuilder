import { useQuery } from "@tanstack/react-query";

import { getProviderOrgDetails } from "src/api/customer-user";

function useProviderOrgDetails() {
  const providerOrgDetailsQuery = useQuery({
    queryKey: ["providerOrgDetails"],
    queryFn: () => {
      return getProviderOrgDetails();
    },
    select: (response) => {
      return response.data;
    },
  });

  return providerOrgDetailsQuery;
}

export default useProviderOrgDetails;
