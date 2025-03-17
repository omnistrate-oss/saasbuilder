import { AxiosResponse } from "axios";
import axios from "src/axios";
import {
  GetCurrentConsumptionUsageSuccessResponse,
  DecribeConsumptionBillingStatusResponse,
  ListConsumptionInvoicesSuccessResponse,
  DescribeConsumptionBillingDetailsSuccessResponse,
  GetConsumptionUsagePerDaySuccessResponse,
} from "src/types/consumption";

export type GetConsumptionUsageQueryParams = {
  subscriptionID?: string;
};

export const getConsumptionUsage = (
  queryParams: GetConsumptionUsageQueryParams = {}
): Promise<AxiosResponse<GetCurrentConsumptionUsageSuccessResponse>> => {
  return axios.get("/resource-instance/usage", {
    params: queryParams,
  });
};

export type GetConsumptionUsagePerDayQueryParams = {
  subscriptionID?: string;
  startDate?: string;
  endDate?: string;
};

export const getConsumptionUsagePerDay = (
  queryParams: GetConsumptionUsagePerDayQueryParams = {}
): Promise<AxiosResponse<GetConsumptionUsagePerDaySuccessResponse>> => {
  return axios.get("/resource-instance/usage-per-day", {
    params: queryParams,
  });
};

export const getConsumptionBillingStatus = (): Promise<
  AxiosResponse<DecribeConsumptionBillingStatusResponse>
> => {
  return axios.get("/resource-instance/billing-status");
};

export const getConsumptionInvoices = (): AxiosResponse<
  Promise<ListConsumptionInvoicesSuccessResponse>
> => {
  // const mockResponse: ListConsumptionInvoicesSuccessResponse = {
  //   invoices: [
  //     {
  //       invoiceId: "in_1QpUa6BtIwo786qgv2Sy8IvQ",
  //       invoiceStatus: "paid",
  //       invoiceDate: "2025-02-06T12:53:22Z",
  //       totalAmountWithoutTax: 999,
  //       taxAmount: 0,
  //       totalAmount: 999,
  //       invoiceUrl:
  //         "https://invoice.stripe.com/i/acct_1MjudfBtIwo786qg/live_YWNjdF8xTWp1ZGZCdEl3bzc4NnFnLF9SaXdUeEliN092UU5wSmdjMmpzc0VVTkkzZVpUb3FrLDEzMDk5NDMyMw0200MEv5PLXE?s=ap",
  //       currency: "usd",
  //       invoicePaymentTerm: "30",
  //     },
  //     {
  //       invoiceId: "in_1QYxLwBtIwo786qgVjLX8Cz1",
  //       invoiceStatus: "paid",
  //       invoiceDate: "2024-12-22T22:10:24Z",
  //       totalAmountWithoutTax: 0,
  //       taxAmount: 0,
  //       totalAmount: 0,
  //       invoiceUrl:
  //         "https://invoice.stripe.com/i/acct_1MjudfBtIwo786qg/live_YWNjdF8xTWp1ZGZCdEl3bzc4NnFnLF9SUnI0VzFFalJqZlVGM250MVNyVUIxS0FJTXB0WnJ0LDEzMDk5NDMyMw0200iwGJMmr1?s=ap",
  //       currency: "usd",
  //       invoicePaymentTerm: "30",
  //     },
  //     {
  //       invoiceId: "in_1QSFRLBtIwo786qgw9R4Id1C",
  //       invoiceStatus: "paid",
  //       invoiceDate: "2024-12-04T10:04:15Z",
  //       totalAmountWithoutTax: 0,
  //       taxAmount: 0,
  //       totalAmount: 0,
  //       invoiceUrl:
  //         "https://invoice.stripe.com/i/acct_1MjudfBtIwo786qg/live_YWNjdF8xTWp1ZGZCdEl3bzc4NnFnLF9SS3ZIUGpFMkJWRnJ0YklnNkRBUVNFMDRkT2lPamJoLDEzMDk5NDMyMw0200oZtOBCiu?s=ap",
  //       currency: "usd",
  //       invoicePaymentTerm: "30",
  //     },
  //   ],
  // };

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(mockResponse);
  //   }, 1500);
  // });
  return axios.get("/resource-instance/invoice");
};

export type GetBillingDetailsQueryParams = { returnUrl: string };

export const getBillingDetails = (
  queryParams: GetBillingDetailsQueryParams
): Promise<AxiosResponse<DescribeConsumptionBillingDetailsSuccessResponse>> => {
  return axios.get("/resource-instance/billing-details", {
    params: queryParams,
  });
};
