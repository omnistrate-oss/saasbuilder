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
