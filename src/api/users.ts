import { AxiosResponse } from "axios";

import axios from "../axios";

export const revokeSubscriptionUser = (subscriptionId, payload) =>
  axios.delete(`/resource-instance/subscription/${subscriptionId}/revoke-user-role`, {
    data: payload,
  });

export const inviteSubscriptionUser = (subscriptionId, payload, suppressErrorSnackbar = false) =>
  axios.post(`/resource-instance/subscription/${subscriptionId}/invite-user`, payload, {
    ignoreGlobalErrorSnack: suppressErrorSnackbar,
  });

export const getUsersBySubscription = (subscriptionId) =>
  axios.get(`/resource-instance/subscription/${subscriptionId}/subscription-users`);

export const updatePassword = (payload) => {
  return axios.post(`/update-password`, payload);
};

export const deleteUser = (): Promise<AxiosResponse<any>> => {
  return axios.delete(`/customer-delete-user`);
};
