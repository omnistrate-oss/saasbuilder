import { AxiosResponse } from "axios";

import { ListSubscriptionsSuccessResponse } from "src/types/subscription";

import axios from "../axios";

export const getSubscriptionIds = (orgId) => {
  return axios.get(`/subscription/org/${orgId}`);
};

export const getSubscription = (subId) => {
  return axios.get(`/subscription/${subId}`);
};

export const deleteSubscription = (subId) => {
  return axios.delete(`/subscription/${subId}`);
};

export const createSubscriptions = (payload, ignoreError = false) => {
  return axios.post(`/subscription`, payload, {
    ignoreGlobalErrorSnack: ignoreError,
  });
};

export const getSubscriptions = (params = {}): Promise<AxiosResponse<ListSubscriptionsSuccessResponse>> => {
  return axios.get(`/subscription`, {
    params,
  });
};

export const listSubscriptions = (query) => {
  return axios.get(`/subscription`, {
    params: query,
  });
};
