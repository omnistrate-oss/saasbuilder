export const getSubscriptionsRoute = ({
  subscriptionId,
  serviceId,
  servicePlanId,
}: {
  subscriptionId?: string;
  serviceId?: string;
  servicePlanId?: string;
}) => {
  if (subscriptionId) {
    return `/subscriptions?subscriptionId=${subscriptionId}`;
  }
  if (serviceId && servicePlanId) {
    return `/subscriptions?serviceId=${serviceId}&servicePlanId=${servicePlanId}`;
  }
  return "/subscriptions";
};

export const getCloudAccountsRoute = ({
  serviceId,
  servicePlanId,
  subscriptionId,
}: {
  serviceId?: string;
  servicePlanId?: string;
  subscriptionId?: string;
}) => {
  if (serviceId && servicePlanId && subscriptionId) {
    return `/cloud-accounts?serviceId=${serviceId}&servicePlanId=${servicePlanId}&subscriptionId=${subscriptionId}`;
  }
  return "/cloud-accounts";
};
