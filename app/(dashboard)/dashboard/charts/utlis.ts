import {
  InstanceComputedHealthStatus,
  ResourceInstanceNetworkTopology,
  ResourceInstanceNode,
  ResourceNetworkTopologyAdditionalEndpoint,
} from "src/types/resourceInstance";

function getInstanceNodes(detailedNetworkTopology: Record<string, ResourceInstanceNetworkTopology> = {}) {
  let nodes: ResourceInstanceNode[] = [];

  Object.entries(detailedNetworkTopology).forEach(([, topologyDetails]) => {
    if (topologyDetails.hasCompute) {
      const nodesList = topologyDetails.nodes || [];
      nodes.push(...nodesList);
    }
  });
  //@ts-ignore
  nodes = nodes.filter((node) => !node.isServerless);

  nodes = _.uniqBy(nodes, "id");

  return nodes;
}

export function getComplexInstanceHealthStatus(
  detailedNetworkTopology: Record<string, ResourceInstanceNetworkTopology> = {}
): InstanceComputedHealthStatus {
  //instance health status for complex resource instances is derived using the node health status and the endpoint health status
  //we get an addtional field called 'additionalEndpoint' in the topology object
  //additional endpoints will have a healthStatus
  //use both node health status and additional endpoint health status to calculate aggregated health status

  //stores addtional endpoints for all resources in detailedNetworkTopology
  const nodes: ResourceInstanceNode[] = getInstanceNodes(detailedNetworkTopology);

  //stores addtional endpoints for all resources in detailedNetworkTopology
  const allAdditionalEndpoints: (ResourceNetworkTopologyAdditionalEndpoint & {
    endpointName: string;
  })[] = [];

  Object.values(detailedNetworkTopology).forEach((topologyDetails) => {
    const additionalEndpoints = topologyDetails.additionalEndpoints || {};
    Object.entries(additionalEndpoints).forEach(([endpointName, endpointDetails]) => {
      allAdditionalEndpoints.push({
        ...endpointDetails,
        endpointName,
      });
    });
  });

  const healthStatusEntities: {
    type: "node" | "additionalEnpoint";
    healthStatus: string;
    nodeID?: string;
    endpoint?: string;
  }[] = [];

  nodes.forEach((node) => {
    healthStatusEntities.push({
      type: "node",
      healthStatus: node.healthStatus || "UNKNOWN",
      nodeID: node.id,
    });
  });

  allAdditionalEndpoints.forEach((addtionalEnpoint) => {
    healthStatusEntities.push({
      type: "additionalEnpoint",
      healthStatus: addtionalEnpoint.healthStatus || "UNKNOWN",
      endpoint: addtionalEnpoint.endpoint,
    });
  });

  let computedHealthStatus: InstanceComputedHealthStatus = "UNKNOWN";

  if (healthStatusEntities.length > 0) {
    const unknownHealthEntities = healthStatusEntities.filter(
      (entity) => entity.healthStatus?.toUpperCase() === "UNKNOWN"
    );
    const naHealthEntities = healthStatusEntities.filter((entity) => entity.healthStatus?.toUpperCase() === "N/A");

    //health status is UNKNOWN if all entities have UNKNOWN health status
    if (unknownHealthEntities.length === healthStatusEntities.length) {
      computedHealthStatus = "UNKNOWN";

      //health status is N/A if all entities have N/A health status
    } else if (naHealthEntities.length === healthStatusEntities.length) {
      computedHealthStatus = "UNKNOWN";

      //health status is UNKNOWN if all entities have either UNKNOWN or N/A health status
    } else if (unknownHealthEntities.length + naHealthEntities.length === healthStatusEntities.length) {
      computedHealthStatus = "UNKNOWN";
    } else {
      //ignore UNKNOWN, N/A entities and calculate health status
      const nonUnknownHealthEntities = healthStatusEntities.filter(
        (node) => node.healthStatus?.toUpperCase() !== "UNKNOWN" && node.healthStatus?.toUpperCase() !== "N/A"
      );
      //healhy if all entities are healthy
      if (nonUnknownHealthEntities.every((entity) => entity.healthStatus === "HEALTHY")) {
        computedHealthStatus = "HEALTHY";
      } else if (
        //unhealhy if all entities are unhealthy
        nonUnknownHealthEntities.every((entity) => entity.healthStatus === "UNHEALTHY")
      ) {
        computedHealthStatus = "UNHEALTHY";
      } else {
        computedHealthStatus = "DEGRADED";
      }
    }
  }

  return computedHealthStatus;
}

export const RESOURCE_TYPES = {
  OperatorCRD: "OperatorCRD",
  Kustomize: "Kustomize",
  HelmChart: "HelmChart",
  Terraform: "Terraform",
  Generic: "Generic",
  Empty: "",
};

export const CLI_MANAGED_RESOURCES = [
  RESOURCE_TYPES.OperatorCRD,
  RESOURCE_TYPES.HelmChart,
  RESOURCE_TYPES.Kustomize,
  RESOURCE_TYPES.Terraform,
];

export function getInstanceHealthStatus(
  detailedNetworkTopology: Record<string, ResourceInstanceNetworkTopology> = {},
  instanceLifecycleStatus: string
): InstanceComputedHealthStatus {
  let isCLIManagedResource = false;
  let isL7LoadBalancer = false;

  //Return UNKOWN status for CLI Managed resources
  if (detailedNetworkTopology) {
    const mainResource = Object.values(detailedNetworkTopology).find(
      (topologyDetails) => topologyDetails.main === true
    );

    if (mainResource && CLI_MANAGED_RESOURCES.includes(mainResource.resourceType as string)) {
      isCLIManagedResource = true;
    }
    if (mainResource && mainResource.resourceType === "l7LoadBalancer") {
      isL7LoadBalancer = true;
    }
  }

  if (isCLIManagedResource || isL7LoadBalancer) return getComplexInstanceHealthStatus(detailedNetworkTopology);

  const nodes: ResourceInstanceNode[] = getInstanceNodes(detailedNetworkTopology);

  let computedHealthStatus: InstanceComputedHealthStatus = "UNKNOWN";

  if (nodes.length > 0) {
    const unknownHealthNodes = nodes.filter((node) => node.healthStatus?.toUpperCase() === "UNKNOWN");
    const naHealthNodes = nodes.filter((node) => node.healthStatus?.toUpperCase() === "N/A");

    //health status is UNKNOWN if all nodes have UNKNOWN health status
    if (unknownHealthNodes.length === nodes.length) {
      computedHealthStatus = "UNKNOWN";

      //health status is UNKNOWN if all nodes have N/A health status
    } else if (naHealthNodes.length === nodes.length) {
      computedHealthStatus = "UNKNOWN";

      //health status is UNKNOWN if all nodes have either UNKNOWN or N/A health status
    } else if (unknownHealthNodes.length + naHealthNodes.length === nodes.length) {
      computedHealthStatus = "UNKNOWN";
    } else {
      //ignore UNKNOWN, N/A nodes and calculate health status
      const nonUnknownHealthNodes = nodes.filter(
        (node) => node.healthStatus?.toUpperCase() !== "UNKNOWN" && node.healthStatus?.toUpperCase() !== "N/A"
      );
      //healhy if all nodes are healthy
      if (nonUnknownHealthNodes.every((node) => node.healthStatus === "HEALTHY")) {
        computedHealthStatus = "HEALTHY";
      } else if (
        //unhealhy if all nodes are unhealthy
        nonUnknownHealthNodes.every((node) => node.healthStatus === "UNHEALTHY")
      ) {
        computedHealthStatus = "UNHEALTHY";
      } else {
        computedHealthStatus = "DEGRADED";
      }
    }
  } else {
    if (instanceLifecycleStatus === "RUNNING" || instanceLifecycleStatus === "READY") {
      computedHealthStatus = "HEALTHY";
    }
  }

  return computedHealthStatus;
}
