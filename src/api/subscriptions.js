import axios from "../axios";

export const getSubscriptionsIds = (orgId) => {
  return axios.get(`/subscription/org/${orgId}`);
};

export const getSubscriptions = (subId) => {
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

export const listSubscriptions = (query) => {
  return axios.get(`/subscription`, {
    params: query,
  });
};
