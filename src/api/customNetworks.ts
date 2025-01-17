import axios from "src/axios";
import {
  CustomNetwork,
  CustomNetworkCreatePayload,
} from "src/types/customNetwork";

export function getCustomNetworks() {
  return axios.get("/resource-instance/custom-network");
}

export function getCustomNetwork(customNetworkID: string) {
  return axios.get(`/resource-instance/custom-network/${customNetworkID}`);
}

export function createCustomNetwork(payload: CustomNetworkCreatePayload) {
  return axios.post("/resource-instance/custom-network", payload);
}

export function modifyCustomNetwork(payload: CustomNetwork) {
  return axios.patch(
    `/resource-instance/custom-network/${payload.id}`,
    payload
  );
}

export function deleteCustomNetwork(customNetworkID: string) {
  return axios.delete(`/resource-instance/custom-network/${customNetworkID}`);
}
