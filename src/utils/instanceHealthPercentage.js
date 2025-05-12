export const calculateInstanceHealthPercentage = (detailedNetworkTopology = {}, instanceStatus) => {
  const nodesFromAllResources = [];
  const detailedNetworkTopologyValues = Object.values(detailedNetworkTopology);

  const mainResource = detailedNetworkTopologyValues.find((value) => {
    return value.main === true;
  });

  const nodesMainResource = mainResource?.nodes;
  if (nodesMainResource?.length > 0) {
    nodesFromAllResources.push(...nodesMainResource);
  }

  // filter out the oberservability resource
  const resourcesOtherThanMainAndObservability = detailedNetworkTopologyValues?.filter((value) => {
    return !value.main && value.resourceKey !== "omnistrateobserv";
  });

  resourcesOtherThanMainAndObservability?.forEach((resource) => {
    const resourceNodes = resource.nodes;
    if (resourceNodes?.length > 0) {
      nodesFromAllResources.push(...resourceNodes);
    }
  });

  //filter nodes with isSeverless flag as true as this is a fake node added on UI and
  //is used for connecting to metrics.logs for serverless resource
  nodesFromAllResources.filter((item) => !item.isServerless);

  let healthStatusPercent = 0;

  if (nodesFromAllResources?.length > 0) {
    const healthyNodes = nodesFromAllResources?.filter((node) => node?.healthStatus === "HEALTHY");
    healthStatusPercent = (healthyNodes?.length / nodesFromAllResources?.length) * 100;
  } else if (instanceStatus === "RUNNING" || instanceStatus === "READY") {
    healthStatusPercent = 100;
  }

  return healthStatusPercent;
};
