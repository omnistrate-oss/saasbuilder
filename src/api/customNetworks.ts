import { AxiosResponse } from "axios";
import axios from "src/axios";
import {
  CustomNetworkCreatePayload,
  ListCustomNetworksSuccessResponse,
  UpdateCustomNetworkSuccessResponse,
  UpdateCustomNetworkRequestBody,
} from "src/types/customNetwork";

export function getCustomNetworks(): Promise<
  AxiosResponse<ListCustomNetworksSuccessResponse>
> {
  return axios.get("/resource-instance/custom-network");
}

export function getCustomNetwork(customNetworkID: string) {
  return axios.get(`/resource-instance/custom-network/${customNetworkID}`);
}

export function createCustomNetwork(payload: CustomNetworkCreatePayload) {
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
