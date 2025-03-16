import { AxiosResponse } from "axios";
import axios from "src/axios";
import {
  GetCurrentConsumptionUsageSuccessResponse,
  DecribeConsumptionBillingStatusResponse,
  ListConsumptionInvoicesSuccessResponse,
  DescribeConsumptionBillingDetailsSuccessResponse,
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

export const getConsumptionBillingStatus = (): Promise<
  AxiosResponse<DecribeConsumptionBillingStatusResponse>
> => {
  return axios.get("/resource-instance/billing-status");
};

export const getConsumptionInvoices = (): Promise<
  AxiosResponse<ListConsumptionInvoicesSuccessResponse>
> => {
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
