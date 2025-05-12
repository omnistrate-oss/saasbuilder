import { AxiosResponse } from "axios";

import { ListAvailabilityZonesByRegionCodeSuccessResponse } from "src/types/availabilityZone";
import { CloudProvider } from "src/types/common/enums";

import axios from "../axios";

export function getAvailabilityZone(
  cloudProviderName: CloudProvider,
  regionCode: string
): Promise<AxiosResponse<ListAvailabilityZonesByRegionCodeSuccessResponse>> {
  return axios.get(`/availability-zone/region/code/${regionCode}/cloud-provider/${cloudProviderName}`);
}
