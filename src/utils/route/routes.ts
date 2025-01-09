export const getInstanceDetailsRoute = ({
  serviceId,
  servicePlanId,
  resourceId,
  instanceId,
  subscriptionId,
}) => {
  return `/instances/${serviceId}/${servicePlanId}/${resourceId}/${instanceId}/${subscriptionId}`;
};
