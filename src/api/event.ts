import { AxiosResponse } from "axios";
import axios from "../axios";
import { ListAllAuditEventsSuccessResponse } from "src/types/auditEvent";

export function getResourceInstanceEvents(resourceInstanceId, subscriptionId) {
  const queryParams: any = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }

  return axios.get(`/resource-instance/${resourceInstanceId}/event`, {
    params: queryParams,
  });
}

export function getEvent(eventId, subscriptionId) {
  const queryParams: any = {};

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
  const queryParams: any = {};

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

export const getAllAuditEvents = (
  params = {}
): Promise<AxiosResponse<ListAllAuditEventsSuccessResponse>> => {
  return axios.get("/resource-instance/audit-events", {
    params,
  });
};
