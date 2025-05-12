export type AccessCapacityDataType = {
  serviceProviderId: string;
  serviceKey: string;
  serviceAPIVersion: string;
  serviceEnvironmentKey: string;
  serviceModelKey: string;
  productTierKey: string;
  resourceKey: string;
  instanceId: string;
  subscriptionId: string;
};

export type FleetCapacityDataType = {
  serviceId: string;
  environmentId: string;
  instanceId: string;
  resourceId: string;
};
export type CapacityAction = "add" | "remove";

export type ContextType = "fleet" | "access";
