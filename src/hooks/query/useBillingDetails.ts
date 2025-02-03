import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getBillingDetails } from "src/api/users";
import { selectUserrootData } from "src/slices/userDataSlice";

function useBillingDetails() {
  const userData = useSelector(selectUserrootData);
  const userId = userData?.id;
  const billingDetailsQuery = useQuery({
    queryKey: ["billingDetails", userId],
    queryFn: () => {
      return getBillingDetails(userId);
    },
    enabled: Boolean(userId),
    select: (response) => {
      return response.data;
    },
    //refetch after 50 mins
    refetchInterval: 3000000,
  });

  return billingDetailsQuery;
}

export default useBillingDetails;
