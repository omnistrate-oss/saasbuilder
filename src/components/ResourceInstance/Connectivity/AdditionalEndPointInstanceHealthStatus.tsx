type HealthStatus = "HEALTHY" | "UNHEALTHY" | "DEGRADED" | "UNKNOWN" | "N/A";

interface Endpoint {
  endpoint: string;
  openPorts: number[];
  networkingType: string;
  primary: boolean;
  healthStatus: HealthStatus;
}

interface AdditionalEndpoints {
  [key: string]: Endpoint;
}

export function getAdditionalEndpointsInstanceHealthStatus(additionalEndpoints: AdditionalEndpoints): HealthStatus {
  let computedHealthStatus: HealthStatus = "UNKNOWN";

  const healthStatusEntities = Object.values(additionalEndpoints);

  if (healthStatusEntities.length > 0) {
    const unknownHealthEntities = healthStatusEntities.filter(
      (entity) => entity.healthStatus?.toUpperCase() === "UNKNOWN"
    );
    const naHealthEntities = healthStatusEntities.filter((entity) => entity.healthStatus?.toUpperCase() === "N/A");

    if (unknownHealthEntities.length === healthStatusEntities.length) {
      computedHealthStatus = "UNKNOWN";
    } else if (naHealthEntities.length === healthStatusEntities.length) {
      computedHealthStatus = "UNKNOWN";
    } else if (unknownHealthEntities.length + naHealthEntities.length === healthStatusEntities.length) {
      computedHealthStatus = "UNKNOWN";
    } else {
      const nonUnknownHealthEntities = healthStatusEntities.filter(
        (node) => node.healthStatus?.toUpperCase() !== "UNKNOWN" && node.healthStatus?.toUpperCase() !== "N/A"
      );

      if (nonUnknownHealthEntities.every((entity) => entity.healthStatus === "HEALTHY")) {
        computedHealthStatus = "HEALTHY";
      } else if (nonUnknownHealthEntities.every((entity) => entity.healthStatus === "UNHEALTHY")) {
        computedHealthStatus = "UNHEALTHY";
      } else {
        computedHealthStatus = "DEGRADED";
      }
    }
  }

  return computedHealthStatus;
}
