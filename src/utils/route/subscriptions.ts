export function getSubscriptionsRoute(serviceId, environmentId, productTierId, subscriptionId = "") {
  return `/subscriptions?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}
