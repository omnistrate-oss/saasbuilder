import { AxiosResponse } from "axios";

import { ListSubscriptionRequestsSuccessResponse } from "src/types/subscriptionRequest";

import axios from "../axios";

export const listSubscriptionRequests = (
  params = {}
): Promise<AxiosResponse<ListSubscriptionRequestsSuccessResponse>> => {
  return axios.get("/subscription/request", {
    params,
  });
};

export const getSubscriptionRequest = (requestId: string) => {
  return axios.get(`/subscription/request/${requestId}`);
};

export const createSubscriptionRequest = (body, ignoreError = false) => {
  return axios.post("/subscription/request", body, {
    ignoreGlobalErrorSnack: ignoreError,
  });
};

export const cancelSubscriptionRequest = (requestId) => {
  return axios.delete(`/subscription/request/${requestId}`);
};
