import axios from "../axios";

export function getRegionIdsByCloudProviderWithParams(serviceId, productTierId, cloudProviderName) {
  const queryParams = {};
  if (serviceId && productTierId) {
    queryParams["serviceId"] = serviceId;
    queryParams["productTierId"] = productTierId;
  }

  return axios.get(`/region/cloudprovider/${cloudProviderName}`, {
    params: queryParams,
  });
}

export const getRegions = (cloudProvider) => {
  return axios.get(`/region/cloudprovider/${cloudProvider}`);
};

export function getRegionById(regionId) {
  return axios.get(`/region/${regionId}`);
}
