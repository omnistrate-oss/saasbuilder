import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getConsumptionInvoices } from "src/api/consumption";

dayjs.extend(utc);

function useConsumptionInvoices() {
  const query = useQuery({
    queryKey: ["consumption-invoices"],
    queryFn: async () => {
      const response = await getConsumptionInvoices();

      const invoices = response.data.invoices || [];
      const updatedInvoices = invoices.map((invoice) => {
        const status = invoice.invoiceStatus;
        const dueDate = invoice.dueDate;
        let isPastDueDate = false;
        if (dueDate && status) {
          isPastDueDate =
            status === "open" && dayjs.utc().isAfter(dayjs.utc(dueDate));
        }
        const invoiceCopy = { ...invoice };
        if (isPastDueDate) {
          invoiceCopy.invoiceStatus = "pastDue";
        }
        return invoiceCopy;
      });

      return {
        invoices: updatedInvoices,
      };
    },
  });

  return query;
}

export default useConsumptionInvoices;
