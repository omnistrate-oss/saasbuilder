import { CurrentTab } from "app/(dashboard)/instances/[serviceId]/[servicePlanId]/[resourceId]/[instanceId]/[subscriptionId]/page";

type InstanceDetailsRouteParams = {
  serviceId: string;
  servicePlanId: string;
  resourceId: string;
  instanceId: string;
  subscriptionId: string;
  viewType?: CurrentTab;
};

export const getInstanceDetailsRoute: (
  params: InstanceDetailsRouteParams
) => string = ({
  serviceId,
  servicePlanId,
  resourceId,
  instanceId,
  subscriptionId,
  viewType,
}) => {
  let url = `/instances/${serviceId}/${servicePlanId}/${resourceId}/${instanceId}/${subscriptionId}`;
  if (viewType) {
    url = url + `?view=${viewType}`;
  }
  return url;
};
