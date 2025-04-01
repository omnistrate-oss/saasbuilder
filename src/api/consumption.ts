import { AxiosResponse } from "axios";
import axios from "src/axios";
import {
  GetCurrentConsumptionUsageSuccessResponse,
  DescribeConsumptionBillingStatusResponse,
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
  const mock = {
    usage: [
      {
        dimension: "Memory GiB hours",
        total: 388,
        startTime: "2025-03-01T00:00:00Z",
        endTime: "2025-03-02T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 752,
        startTime: "2025-03-01T00:00:00Z",
        endTime: "2025-03-02T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 752,
        startTime: "2025-03-01T00:00:00Z",
        endTime: "2025-03-02T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 456,
        startTime: "2025-03-02T00:00:00Z",
        endTime: "2025-03-03T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 856,
        startTime: "2025-03-02T00:00:00Z",
        endTime: "2025-03-03T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 856,
        startTime: "2025-03-02T00:00:00Z",
        endTime: "2025-03-03T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 528,
        startTime: "2025-03-03T00:00:00Z",
        endTime: "2025-03-04T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 954,
        startTime: "2025-03-03T00:00:00Z",
        endTime: "2025-03-04T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 954,
        startTime: "2025-03-03T00:00:00Z",
        endTime: "2025-03-04T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 1064,
        startTime: "2025-03-04T00:00:00Z",
        endTime: "2025-03-05T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 1886,
        startTime: "2025-03-04T00:00:00Z",
        endTime: "2025-03-05T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 1886,
        startTime: "2025-03-04T00:00:00Z",
        endTime: "2025-03-05T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 880,
        startTime: "2025-03-05T00:00:00Z",
        endTime: "2025-03-06T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 1682,
        startTime: "2025-03-05T00:00:00Z",
        endTime: "2025-03-06T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 1682,
        startTime: "2025-03-05T00:00:00Z",
        endTime: "2025-03-06T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 584,
        startTime: "2025-03-06T00:00:00Z",
        endTime: "2025-03-07T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 1110,
        startTime: "2025-03-06T00:00:00Z",
        endTime: "2025-03-07T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 1110,
        startTime: "2025-03-06T00:00:00Z",
        endTime: "2025-03-07T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 786,
        startTime: "2025-03-07T00:00:00Z",
        endTime: "2025-03-08T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 1526,
        startTime: "2025-03-07T00:00:00Z",
        endTime: "2025-03-08T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 1526,
        startTime: "2025-03-07T00:00:00Z",
        endTime: "2025-03-08T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 424,
        startTime: "2025-03-08T00:00:00Z",
        endTime: "2025-03-09T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 822,
        startTime: "2025-03-08T00:00:00Z",
        endTime: "2025-03-09T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 822,
        startTime: "2025-03-08T00:00:00Z",
        endTime: "2025-03-09T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 378,
        startTime: "2025-03-09T00:00:00Z",
        endTime: "2025-03-10T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 724,
        startTime: "2025-03-09T00:00:00Z",
        endTime: "2025-03-10T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 724,
        startTime: "2025-03-09T00:00:00Z",
        endTime: "2025-03-10T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 1108,
        startTime: "2025-03-10T00:00:00Z",
        endTime: "2025-03-11T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 2026,
        startTime: "2025-03-10T00:00:00Z",
        endTime: "2025-03-11T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 2026,
        startTime: "2025-03-10T00:00:00Z",
        endTime: "2025-03-11T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 994,
        startTime: "2025-03-11T00:00:00Z",
        endTime: "2025-03-12T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 1846,
        startTime: "2025-03-11T00:00:00Z",
        endTime: "2025-03-12T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 1846,
        startTime: "2025-03-11T00:00:00Z",
        endTime: "2025-03-12T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 898,
        startTime: "2025-03-12T00:00:00Z",
        endTime: "2025-03-13T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 898,
        startTime: "2025-03-12T00:00:00Z",
        endTime: "2025-03-13T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 484,
        startTime: "2025-03-12T00:00:00Z",
        endTime: "2025-03-13T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 706,
        startTime: "2025-03-13T00:00:00Z",
        endTime: "2025-03-14T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 1316,
        startTime: "2025-03-13T00:00:00Z",
        endTime: "2025-03-14T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 1316,
        startTime: "2025-03-13T00:00:00Z",
        endTime: "2025-03-14T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 498,
        startTime: "2025-03-14T00:00:00Z",
        endTime: "2025-03-15T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 946,
        startTime: "2025-03-14T00:00:00Z",
        endTime: "2025-03-15T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 946,
        startTime: "2025-03-14T00:00:00Z",
        endTime: "2025-03-15T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 730,
        startTime: "2025-03-15T00:00:00Z",
        endTime: "2025-03-16T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 730,
        startTime: "2025-03-15T00:00:00Z",
        endTime: "2025-03-16T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 380,
        startTime: "2025-03-15T00:00:00Z",
        endTime: "2025-03-16T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 374,
        startTime: "2025-03-16T00:00:00Z",
        endTime: "2025-03-17T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 720,
        startTime: "2025-03-16T00:00:00Z",
        endTime: "2025-03-17T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 720,
        startTime: "2025-03-16T00:00:00Z",
        endTime: "2025-03-17T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 460,
        startTime: "2025-03-17T00:00:00Z",
        endTime: "2025-03-18T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 876,
        startTime: "2025-03-17T00:00:00Z",
        endTime: "2025-03-18T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 876,
        startTime: "2025-03-17T00:00:00Z",
        endTime: "2025-03-18T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 574,
        startTime: "2025-03-18T00:00:00Z",
        endTime: "2025-03-19T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 1084,
        startTime: "2025-03-18T00:00:00Z",
        endTime: "2025-03-19T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 1084,
        startTime: "2025-03-18T00:00:00Z",
        endTime: "2025-03-19T00:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 520,
        startTime: "2025-03-19T00:00:00Z",
        endTime: "2025-03-20T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 976,
        startTime: "2025-03-19T00:00:00Z",
        endTime: "2025-03-20T00:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 976,
        startTime: "2025-03-19T00:00:00Z",
        endTime: "2025-03-20T00:00:00Z",
      },
      {
        dimension: "Storage GiB hours",
        total: 932,
        startTime: "2025-03-20T00:00:00Z",
        endTime: "2025-03-20T10:00:00Z",
      },
      {
        dimension: "CPU core hours",
        total: 932,
        startTime: "2025-03-20T00:00:00Z",
        endTime: "2025-03-20T10:00:00Z",
      },
      {
        dimension: "Memory GiB hours",
        total: 494,
        startTime: "2025-03-20T00:00:00Z",
        endTime: "2025-03-20T10:00:00Z",
      },
    ],
    startTime: "2025-03-01T00:00:00Z",
    endTime: "2025-03-20T10:00:00Z",
  };

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(mock);
  //   }, 1000);
  // });
  return axios.get("/resource-instance/usage-per-day", {
    params: queryParams,
  });
};

export const getConsumptionBillingStatus = (): Promise<
  AxiosResponse<DescribeConsumptionBillingStatusResponse>
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
