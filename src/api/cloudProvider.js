import rawAxios from "axios"; //unconfigured axios to make calls to next js server

export const getCloudProviders = () => {
  return rawAxios.get("/api/cloud-providers");
};
