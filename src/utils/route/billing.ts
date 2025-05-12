export function getBillingRoute(serviceId, environmentId, productTierId, subscriptionId = "") {
  return `/billing?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}
