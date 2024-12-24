import axios from "../axios";

export const listSubscriptionRequests = (query) => {
  return axios.get("/subscription/request", {
    params: query,
  });
};

export const createSubscriptionRequest = (body, ignoreError = false) => {
  return axios.post("/subscription/request", body, {
    ignoreGlobalErrorSnack: ignoreError,
  });
};

export const cancelSubscriptionRequest = (requestId) => {
  return axios.delete(`/subscription/request/${requestId}`);
};
