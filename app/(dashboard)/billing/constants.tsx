const options: any = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

export const sampleInvoices = [
  {
    pastDue: "No",
    invoiceStatus: "Paid",
    // 1 Month ago
    invoiceDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    ).toLocaleDateString("en-US", options),
    // Current Month
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toLocaleDateString("en-US", options),
    amount: "$58.09",
    amountPaid: "$58.09",
    paymentTerm: "Net 30",
  },
  {
    pastDue: "No",
    invoiceStatus: "Paid",
    // 2 Months ago
    invoiceDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 2,
      1
    ).toLocaleDateString("en-US", options),
    // 1 Month ago
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    ).toLocaleDateString("en-US", options),
    amount: "$82.63",
    amountPaid: "$82.63",
    paymentTerm: "Net 30",
  },
  {
    pastDue: "No",
    invoiceStatus: "Paid",
    // 3 Months ago
    invoiceDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 3,
      1
    ).toLocaleDateString("en-US", options),
    // 2 Months ago
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 2,
      1
    ).toLocaleDateString("en-US", options),
    amount: "$64.24",
    amountPaid: "$64.24",
    paymentTerm: "Net 30",
  },
];
