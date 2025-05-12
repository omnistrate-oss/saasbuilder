type SettingsView = "profile" | "password" | "billing-address";

export function getSettingsRoute(serviceId, environmentId, productTierId, subscriptionId = "", view?: SettingsView) {
  let route = `/settings?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}&subscriptionId=${subscriptionId}`;

  if (view) {
    route = route + `&view=${view}`;
  }
  return route;
}
