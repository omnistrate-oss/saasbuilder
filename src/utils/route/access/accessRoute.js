export function getAccessRoute(serviceId, environmentId, productTierId) {
  if (serviceId && environmentId && productTierId)
    return `/access?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}`;
  if (serviceId && environmentId)
    return `/access?serviceId=${serviceId}&environmentId=${environmentId}`;
  if (serviceId) return `/access?serviceId=${serviceId}`;
  return `/access`;
}

export function getMarketplaceProductTierRoute(
  serviceId,
  environmentId,
  serviceType
) {
  if (serviceId && environmentId && serviceType)
    return `/service-plans?serviceId=${serviceId}&environmentId=${environmentId}&serviceType=${serviceType}`;
  if (serviceId && environmentId)
    return `/service-plans?serviceId=${serviceId}&environmentId=${environmentId}`;
  if (serviceId) {
    return `/service-plans?serviceId=${serviceId}`;
  }
  return "/service-plans";
}

export function getDashboardRoute(
  serviceId,
  environmentId,
  productTierId,
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/dashboard?productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}

export function getEventRoute(
  serviceId,
  environmentId,
  productTierId,
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/events?productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}
export function getAccessControlRoute(
  serviceId,
  environmentId,
  productTierId,
  subscriptionId = "",
  searchUserId
) {
  let route = `/access/${serviceId}/${environmentId}/access-control?productTierId=${productTierId}&subscriptionId=${subscriptionId}`;

  if (searchUserId) {
    route = route + `&searchUserId=${searchUserId}`;
  }
  return route;
}

export function getAuditLogsRoute(
  serviceId,
  environmentId,
  productTierId,
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/audit-logs?productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}

export function getNotificationsRoute(
  serviceId,
  environmentId,
  productTierId,
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/notifications?productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}

export function getResourceRoute(
  serviceId,
  environmentId,
  productTierId,
  subscriptionId
) {
  let url = `/access/service/${serviceId}?environmentId=${environmentId}&productTierId=${productTierId}`;
  if (subscriptionId) {
    url += `&subscriptionId=${subscriptionId}`;
  }
  return url;
}

export function getResourceRouteWithoutEnv(
  serviceId,
  productTierId,
  subscriptionId = ""
) {
  return `/access/service/${serviceId}?productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}

export function getResourceInstancesRoute(
  serviceId,
  environmentId,
  productTierId,
  resourceId,
  subscriptionId = ""
) {
  return `/access/service/${serviceId}?environmentId=${environmentId}&resourceId=${resourceId}&productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}

export function getResourceInstancesDetailsRoute(
  serviceId,
  environmentId,
  productTierId,
  resourceId,
  resourceInstanceId,
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/${resourceId}/${resourceInstanceId}?productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}

export function getResourceInstancesDetailswithKeyRoute(
  serviceId,
  environmentId,
  productTierId,
  resourceId,
  resourceInstanceId,
  key,
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/${resourceId}/${resourceInstanceId}?productTierId=${productTierId}&view=${key}&subscriptionId=${subscriptionId}`;
}

export function getMarketplaceRoute(serviceId, environmentId, productTierId) {
  return `/service-plans?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}`;
}

export function getAPIDocsRoute(
  serviceId,
  environmentId,
  productTierId,
  subscriptionId = ""
) {
  return `/access/api-document?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}&subscriptionId=${subscriptionId}`;
}
