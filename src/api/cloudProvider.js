import axios from "../axios";
import rawAxios from "axios"; //unconfigured axios to make calls to next js server

export const getCloudProviderIds = (
  serviceId = null,
  serviceModelId = null
) => {
  const queryParams = {};
  if (serviceId && serviceModelId) {
    queryParams.serviceId = serviceId;
    queryParams.serviceModelId = serviceModelId;
  }

  return axios.get("/cloud-provider", {
    params: queryParams,
  });
};
export const getCloudProvider = (providerId) => {
  return axios.get(`/cloud-provider/${providerId}`);
};

export const getCloudProviders = () => {
  return rawAxios.get("/api/cloud-providers");
};
