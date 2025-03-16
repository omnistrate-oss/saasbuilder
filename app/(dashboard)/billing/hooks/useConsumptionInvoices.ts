import { useQuery } from "@tanstack/react-query";
import { getConsumptionInvoices } from "src/api/consumption";

function useConsumptionInvoices() {
  const query = useQuery({
    queryKey: ["consumption-invoices"],
    queryFn: async () => {
      const response = await getConsumptionInvoices();

      return response.data;
    },
  });

  return query;
}

export default useConsumptionInvoices;
