import { useQuery } from "@tanstack/react-query";
import { getBillingDetails } from "src/api/consumption";

function useBillingDetails() {
  const baseURL =
    typeof window !== "undefined" ? `${window.location.origin}/billing` : "";

  const query = useQuery({
    queryKey: ["consumption-billing-details", baseURL],
    queryFn: async () => {
      const response = await getBillingDetails({
        returnUrl: baseURL.includes("localhost")
          ? "https://omnistrate-access-ui.fly.dev/signin"
          : baseURL,
      });

      return response.data;
    },
  });

  return query;
}

export default useBillingDetails;
