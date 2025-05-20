import { AxiosResponse } from "axios";

import axios from "src/axios";
import {
  DescribeConsumptionBillingDetailsSuccessResponse,
  DescribeConsumptionBillingStatusResponse,
  GetConsumptionUsagePerDaySuccessResponse,
  GetCurrentConsumptionUsageSuccessResponse,
  ListConsumptionInvoicesSuccessResponse,
} from "src/types/consumption";

export type GetConsumptionUsageQueryParams = {
  subscriptionID?: string;
};

export const getConsumptionUsage = (
  queryParams: GetConsumptionUsageQueryParams = {}
): Promise<AxiosResponse<GetCurrentConsumptionUsageSuccessResponse>> => {
  return axios.get("/resource-instance/usage", {
    params: queryParams,
    ignoreGlobalErrorSnack: true,
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

export const getConsumptionBillingStatus = (): Promise<AxiosResponse<DescribeConsumptionBillingStatusResponse>> => {
  return axios.get("/resource-instance/billing-status", {
    ignoreGlobalErrorSnack: true,
  });
};

export const getConsumptionInvoices = (): Promise<AxiosResponse<ListConsumptionInvoicesSuccessResponse>> => {
  return axios.get("/resource-instance/invoice");
};

export type GetBillingDetailsQueryParams = { returnUrl: string };

export const getBillingDetails = (
  queryParams: GetBillingDetailsQueryParams
): Promise<AxiosResponse<DescribeConsumptionBillingDetailsSuccessResponse>> => {
  return axios.get("/resource-instance/billing-details", {
    params: queryParams,
    ignoreGlobalErrorSnack: true,
  });
};
