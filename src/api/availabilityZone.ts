import { AxiosResponse } from "axios";

import axios from "../axios";

import { CloudProvider } from "src/types/common/enums";
import { ListAvailabilityZonesByRegionCodeSuccessResponse } from "src/types/availabilityZone";

export function getAvailabilityZone(
  cloudProviderName: CloudProvider,
  regionCode: string
): Promise<AxiosResponse<ListAvailabilityZonesByRegionCodeSuccessResponse>> {
  return axios.get(
    `/availability-zone/region/code/${regionCode}/cloud-provider/${cloudProviderName}`
  );
}
