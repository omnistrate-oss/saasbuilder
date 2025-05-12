import { AxiosResponse } from "axios";

import axios from "src/axios";
import {
  CreateCustomNetworkRequestBody,
  CreateCustomNetworkSuccessResponse,
  ListCustomNetworksSuccessResponse,
  UpdateCustomNetworkRequestBody,
  UpdateCustomNetworkSuccessResponse,
} from "src/types/customNetwork";

export function getCustomNetworks(params = {}): Promise<AxiosResponse<ListCustomNetworksSuccessResponse>> {
  return axios.get("/resource-instance/custom-network", { params });
}

export function getCustomNetwork(customNetworkID: string) {
  return axios.get(`/resource-instance/custom-network/${customNetworkID}`);
}

export function createCustomNetwork(
  payload: CreateCustomNetworkRequestBody
): Promise<AxiosResponse<CreateCustomNetworkSuccessResponse>> {
  return axios.post("/resource-instance/custom-network", payload);
}

export function updateCustomNetwork(
  id: string,
  payload: UpdateCustomNetworkRequestBody
): Promise<AxiosResponse<UpdateCustomNetworkSuccessResponse>> {
  return axios.patch(`/resource-instance/custom-network/${id}`, payload);
}

export function deleteCustomNetwork(customNetworkID: string) {
  return axios.delete(`/resource-instance/custom-network/${customNetworkID}`);
}
