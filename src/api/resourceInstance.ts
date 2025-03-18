import { AxiosResponse } from "axios";

import axios from "../axios";

import {
  DescribeResourceInstanceSuccessResponse,
  ListAllResourceInstancesSuccessResponse,
} from "src/types/resourceInstance";

export const createResourceInstance = (payload) => {
  const queryParams: any = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}`,
    {
      cloud_provider: payload.cloud_provider,
      network_type: payload.network_type,
      region: payload.region,
      requestParams: payload.requestParams,
      custom_network_id: payload.custom_network_id,
    },
    { params: queryParams }
  );
};

export const updateResourceInstance = (payload) => {
  const queryParams: any = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.put(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}?subscriptionId=${payload.subscriptionId}`,
    {
      requestParams: payload.requestParams,
    },
    { params: queryParams }
  );
};

export const startResourceInstance = (payload) => {
  const queryParams: any = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}/start`,
    {},
    { params: queryParams }
  );
};

export const stopResourceInstance = (payload) => {
  const queryParams: any = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}/stop`,
    {},
    { params: queryParams }
  );
};

export const restartResourceInstance = (payload) => {
  const queryParams: any = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}/restart`,
    {},
    { params: queryParams }
  );
};

export const getResourceInstanceIds = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  subscriptionId
) => {
  const queryParams: any = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }

  return axios.get(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}`,
    {
      params: queryParams,
    }
  );
};

export const getResourceInstanceDetails = (
  serviceProviderId: string,
  serviceKey: string,
  serviceAPIVersion: string,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  id,
  subscriptionId
): Promise<AxiosResponse<DescribeResourceInstanceSuccessResponse>> => {
  const queryParams: any = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }

  return axios.get(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${id}`,
    {
      params: queryParams,
    }
  );
};

export const getDeploymentCellToken = (payload) => {
  return axios.post(
    `/resource-instance/${payload.instanceId}/deployment-cell-dashboard/token?subscriptionId=${payload.subscriptionId}`
  );
};

export const deleteResourceInstance = (payload) => {
  const queryParams: any = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }
  return axios.delete(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}`,
    {
      params: queryParams,
    }
  );
};

export const getTerraformKitURL = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  subscriptionId,
  cloudProvider
) => {
  const queryParams: any = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }
  return `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/setup-kit/${cloudProvider}?subscriptionId=${subscriptionId}`;
};

export const getTerraformKit = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  subscriptionId,
  cloudProvider
) => {
  const queryParams: any = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }
  return axios.get(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/setup-kit/${cloudProvider}`,
    {
      params: queryParams,
      responseType: "blob",
    }
  );
};

export const disconnected = (data) => {
  const { instanceId, disconnect, serviceId, subscriptionId } = data;

  return axios.post(
    `/resource-instance/account-config/${instanceId}?subscriptionId=${subscriptionId}`,
    {
      setConnections: disconnect,
      serviceId,
    }
  );
};

export const failoverResourceInstanceNode = (data) => {
  const {
    serviceProviderId,
    serviceKey,
    serviceAPIVersion,
    serviceEnvironmentKey,
    serviceModelKey,
    productTierKey,
    resourceKey,
    instanceId,
    failedReplicaId,
    failedReplicaAction = "FAILOVER_AND_RESTART",
    subscriptionId,
  } = data;
  const queryParams: any = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }

  return axios.post(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${instanceId}/failover`,
    {
      failedReplicaId,
      failedReplicaAction,
    },
    { params: queryParams }
  );
};

export const restoreResourceInstance = (payload) => {
  const queryParams: any = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }
  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}/restore`,
    {
      targetRestoreTime: payload.targetRestoreTime,
      network_type: payload.network_type,
    },
    { params: queryParams }
  );
};

export const addCustomDNSToResourceInstance = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  instanceId,
  subscriptionID,
  payload
) => {
  const queryParams: any = {};

  if (subscriptionID) {
    queryParams.subscriptionId = subscriptionID;
  }

  return axios.post(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${instanceId}/custom-dns`,
    payload,
    {
      params: queryParams,
    }
  );
};

export const removeCustomDNSFromResourceInstance = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  instanceId,
  subscriptionID
) => {
  const queryParams: any = {};

  if (subscriptionID) {
    queryParams.subscriptionId = subscriptionID;
  }

  return axios.delete(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${instanceId}/custom-dns`,
    {
      params: queryParams,
    }
  );
};

export const postInstanceRestoreAccess = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  snapshotId,
  subscriptionId,
  data = {},
  queryParams = {}
) => {
  return axios.post(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/snapshot/${snapshotId}/restore?subscriptionId=${subscriptionId}`,
    data,
    {
      params: queryParams,
    }
  );
};

export const getInstanceRestoreAccess = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  instanceId,
  subscriptionId,
  config = {}
) => {
  return axios.get(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${instanceId}/snapshot?subscriptionId=${subscriptionId}`,
    { ...config }
  );
};

//Add Capacity to resource instance
export const addCapacityResourceInstanceAccess = ({ data, count }) => {
  const {
    serviceProviderId,
    serviceKey,
    serviceAPIVersion,
    serviceEnvironmentKey,
    serviceModelKey,
    productTierKey,
    resourceKey,
    instanceId,
    subscriptionId,
  } = data;

  return axios.post(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${instanceId}/add-capacity`,
    { capacityToBeAdded: count },
    {
      params: {
        subscriptionId,
      },
    }
  );
};

//Remove Capacity to resource instance
export const removeCapacityResourceInstanceAccess = ({ data, count }) => {
  const {
    serviceProviderId,
    serviceKey,
    serviceAPIVersion,
    serviceEnvironmentKey,
    serviceModelKey,
    productTierKey,
    resourceKey,
    instanceId,
    subscriptionId,
  } = data;
  return axios.post(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${instanceId}/remove-capacity`,
    {
      capacityToBeRemoved: count,
    },
    {
      params: {
        subscriptionId,
      },
    }
  );
};

export const getAllResourceInstances = (
  params = {}
): Promise<AxiosResponse<ListAllResourceInstancesSuccessResponse>> => {
  return axios.get("/resource-instance", { params });
};
