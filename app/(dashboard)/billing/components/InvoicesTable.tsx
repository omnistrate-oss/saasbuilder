import { createColumnHelper } from "@tanstack/react-table";
import useConsumptionInvoices from "../hooks/useConsumptionInvoices";
import { Invoice } from "src/types/consumption";
import DataTable from "src/components/DataTable/DataTable";
import { useMemo } from "react";
import { Text } from "src/components/Typography/Typography";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";
import InvoiceIcon from "src/components/Icons/Invoice/Invoice";
import StatusChip from "src/components/StatusChip/StatusChip";
import { getInvoiceStatusStylesAndLabel } from "src/constants/statusChipStyles/invoiceStatus";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const columnHelper = createColumnHelper<Invoice>();

const TableHeader = () => {
  return (
    <div className=" py-5 px-6 border-b border-[#E4E7EC]">
      <Text size="large" weight="semibold" color="#101828">
        Invoices
      </Text>
    </div>
  );
};

function InvoicesTable() {
  const { data: invoicesData } = useConsumptionInvoices();
  const invoices = invoicesData?.invoices || [];

  const columns = useMemo(() => {
    return [
      //@ts-ignore
      columnHelper.accessor("invoiceNumber", {
        id: "invoiceNumber",
        header: "Invoice Number",
        meta: {
          minWidth: 320,
        },
        cell: (data) => {
          //@ts-ignore
          const { invoiceUrl, invoiceNumber } = data.row.original;
          return (
            <GridCellExpand
              startIcon={<InvoiceIcon />}
              value={invoiceNumber as string}
              href={invoiceUrl}
              externalLinkArrow
              target="_blank"
              textStyles={{ marginLeft: "6px" }}
            />
          );
        },
      }),
      columnHelper.accessor("invoiceDate", {
        id: "invoiceDate",
        header: "Invoice Date",
        meta: {
          minWidth: 240,
        },
        cell: (data) => {
          const invoiceDate = data.row.original.invoiceDate;
          const formattedDate = dayjs.utc(invoiceDate).format("YYYY-MM-DD");
          return (
            <Text size="small" weight="regular" color="#475467" ellipsis>
              {formattedDate}
            </Text>
          );
        },
      }),
      columnHelper.accessor("invoiceStatus", {
        id: "invoiceStatus",
        header: "Invoice Status",
        meta: {
          minWidth: 100,
        },
        cell: (data) => {
          const status = data.row.original.invoiceStatus;

          return (
            <StatusChip {...getInvoiceStatusStylesAndLabel(status as string)} />
          );
        },
      }),
      //   columnHelper.accessor("totalAmountWithoutTax", {
      //     id: "totalAmountWithoutTax",
      //     header: "Total Amount Without Tax ",
      //     cell: (data) => {
      //       const totalAmountWithoutTax = data.row.original.totalAmountWithoutTax;
      //       return (
      //         <Text size="small" weight="regular" color="#475467" ellipsis>
      //           {`$${totalAmountWithoutTax}`}
      //         </Text>
      //       );
      //     },
      //     meta: {
      //       minWidth: 200,
      //     },
      //   }),
      //   columnHelper.accessor("taxAmount", {
      //     id: "taxAmount",
      //     header: "Tax Amount",
      //     cell: (data) => {
      //       const taxAmount = data.row.original.taxAmount;
      //       return (
      //         <Text size="small" weight="regular" color="#475467" ellipsis>
      //           {`$${taxAmount}`}
      //         </Text>
      //       );
      //     },
      //     meta: { minWidth: 150 },
      //   }),
      columnHelper.accessor("totalAmount", {
        id: "totalAmount",
        header: "Total Amount (USD)",
        cell: (data) => {
          const totalAmount = data.row.original.totalAmount;
          let formattedAmount: string =
            totalAmount !== undefined ? totalAmount?.toString() : "";
          if (totalAmount !== undefined) {
            formattedAmount = totalAmount?.toFixed(2);
          }
          return (
            <Text size="small" weight="regular" color="#475467" ellipsis>
              {`$${formattedAmount}`}
            </Text>
          );
        },
        meta: {
          minWidth: 150,
        },
      }),
    ];
  }, []);

  return (
    <DataTable
      columns={columns}
      rows={invoices}
      HeaderComponent={TableHeader}
      noRowsText="No invoices"
      tableStyles={{ marginTop: "12px" }}
    />
  );
}

export default InvoicesTable;
