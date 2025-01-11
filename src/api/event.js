import axios from "../axios";

export function getResourceInstanceEvents(resourceInstanceId, subscriptionId) {
  const queryParams = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }

  return axios.get(`/resource-instance/${resourceInstanceId}/event`, {
    params: queryParams,
  });
}

export function getEvent(eventId, subscriptionId) {
  const queryParams = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }
  return axios.get(`/resource-instance/event/${eventId}`, {
    params: queryParams,
  });
}

export function getAllEvents(
  serviceProviderId,
  serviceURLKey,
  serviceAPIVersion,
  serviceEnvironmentURLKey,
  serviceModelURLKey,
  productTierURLKey,
  subscriptionId
) {
  const queryParams = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }
  return axios.get(
    `/resource-instance/${serviceProviderId}/${serviceURLKey}/${serviceAPIVersion}/${serviceEnvironmentURLKey}/${serviceModelURLKey}/${productTierURLKey}/event`,
    {
      params: queryParams,
    }
  );
}

export const getAllAuditEvents = (params = {}) => {
  return axios.get("/resource-instance/audit-events", {
    params,
  });
};
