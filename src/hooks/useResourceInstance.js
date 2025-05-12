import { useQuery } from "@tanstack/react-query";
import _ from "lodash";

import { calculateInstanceHealthPercentage } from "src/utils/instanceHealthPercentage";

import { getResourceInstanceDetails } from "../api/resourceInstance";
import processClusterPorts from "../utils/processClusterPorts";

export default function useResourceInstance(
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  resourceInstanceId,
  resourceId,
  subscriptionId
) {
  const isQueryEnabled = Boolean(
    serviceProviderId &&
      serviceKey &&
      serviceAPIVersion &&
      serviceEnvironmentKey &&
      serviceModelKey &&
      productTierKey &&
      resourceKey &&
      resourceInstanceId &&
      subscriptionId
  );

  const resourceInstanceQuery = useQuery(
    [
      "resource-instance",
      serviceProviderId,
      serviceKey,
      serviceAPIVersion,
      serviceEnvironmentKey,
      serviceModelKey,
      productTierKey,
      resourceKey,
      resourceInstanceId,
      subscriptionId,
    ],
    () => {
      return getResourceInstanceDetails(
        serviceProviderId,
        serviceKey,
        serviceAPIVersion,
        serviceEnvironmentKey,
        serviceModelKey,
        productTierKey,
        resourceKey,
        resourceInstanceId,
        subscriptionId
      );
    },
    {
      enabled: isQueryEnabled,
      retry: false,
      refetchInterval: 60000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,

      select: (response) => {
        const data = response.data;

        let isLogsEnabled = false;
        let isMetricsEnabled = false;
        let metricsSocketURL = "";
        let logsSocketURL = "";
        let customNetworkDetails = null;

        if (data.customNetworkDetail) {
          customNetworkDetails = data.customNetworkDetail;
        }

        const topologyDetails = data?.detailedNetworkTopology?.[resourceId];
        const nodeEndpointsList = [];
        const availabilityZonesList = [];
        const nodes = [];
        const globalEndpoints = {};

        if (topologyDetails) {
          globalEndpoints.primary = {
            resourceName: topologyDetails.resourceName,
            endpoint: topologyDetails.clusterEndpoint
              ? topologyDetails.clusterEndpoint
              : "",
            customDNSEndpoint: topologyDetails.customDNSEndpoint,
            resourceId: resourceId,
            resourceKey: topologyDetails.resourceKey,
            resourceHasCompute: topologyDetails.hasCompute,
            publiclyAccessible: topologyDetails.publiclyAccessible,
          };
          globalEndpoints.others = [];
        }

        const customMetrics = [];
        // let otherResourcesCustomMetrics = [];
        const productTierFeatures = data?.productTierFeatures;

        if (productTierFeatures?.LOGS?.enabled) {
          isLogsEnabled = true;
        }

        if (productTierFeatures?.METRICS?.enabled) {
          isMetricsEnabled = true;

          const additionalMetrics =
            productTierFeatures?.METRICS?.additionalMetrics;

          //check if custom metrics are configured
          if (additionalMetrics) {
            Object.entries(additionalMetrics).forEach(([resourceKey, data]) => {
              const metricsData = data?.metrics;
              if (metricsData) {
                Object.entries(metricsData).forEach(
                  ([metricName, labelsObj]) => {
                    const labels = Object.keys(labelsObj || {});
                    customMetrics.push({
                      metricName,
                      labels,
                      resourceKey,
                    });
                  }
                );
              }
            });
          }
        }
        if (topologyDetails?.hasCompute === true) {
          if (topologyDetails?.nodes) {
            topologyDetails.nodes.forEach((node) => {
              const nodeId = node.id;
              const endpoint = node.endpoint;
              const ports = processClusterPorts(node.ports);
              const availabilityZone = node.availabilityZone;
              const status = node.status;
              const resourceName = topologyDetails.resourceName;
              const resourceKey = topologyDetails.resourceKey;
              const healthStatus = node.healthStatus;
              const detailedHealth = node.detailedHealth;
              const isJob = topologyDetails?.isJob;
              const isMain = topologyDetails?.main;
              nodes.push({
                ...node,
                id: nodeId,
                nodeId: nodeId,
                endpoint: endpoint,
                ports: ports,
                availabilityZone: availabilityZone,
                status: status,
                searchString: `${nodeId}${endpoint}${ports}${availabilityZone}${status}`,
                resourceName: resourceName,
                healthStatus: healthStatus,
                resourceKey: resourceKey,
                displayName: nodeId,
                detailedHealth: detailedHealth,
                storageSize: node.storageSize,
                isJob,
                isMain,
              });

              nodeEndpointsList.push(node.endpoint);
              availabilityZonesList.push(node.availabilityZone);
            });
          } else {
            // assume that the resource is serverless
            if (!resourceId.includes("r-obsrv") && data.status === "RUNNING") {
              nodes.push({
                id: `${topologyDetails.resourceKey}-0`,
                displayName: `serverless-${topologyDetails.resourceKey}`,
                isServerless: true,
                resourceKey: topologyDetails.resourceKey,
                resourceId,
              });
            }
          }
        }

        const nodeEndpoints = nodeEndpointsList.join(", ");
        const availabilityZones = [...new Set(availabilityZonesList)].join(
          ", "
        );

        const createdAt = data.created_at;
        const modifiedAt = data.last_modified_at;

        const topologyDetailsOtherThanMain = Object.entries(
          data.detailedNetworkTopology ?? {}
        )?.filter(([, topologyDetails]) => {
          return topologyDetails.main === false;
        });

        topologyDetailsOtherThanMain?.forEach(
          ([resourceId, topologyDetails]) => {
            const { resourceKey } = topologyDetails;
            if (resourceKey === "omnistrateobserv") {
              // Show Both Logs and Metrics if Observability Resource Present
              // isLogsEnabled = true;
              // isMetricsEnabled = true;

              const clusterEndpoint = topologyDetails.clusterEndpoint;
              const [userPass, baseURL] = clusterEndpoint.split("@");
              if (userPass && baseURL) {
                const [username, password] = userPass.split(":");
                metricsSocketURL = `wss://${baseURL}/metrics?username=${username}&password=${password}`;
                logsSocketURL = `wss://${baseURL}/logs?username=${username}&password=${password}`;
              }

              globalEndpoints.others.push({
                resourceName: topologyDetails.resourceName,
                endpoint: topologyDetails.clusterEndpoint
                  ? topologyDetails.clusterEndpoint
                  : "",
                customDNSEndpoint: topologyDetails.customDNSEndpoint,
                resourceId: resourceId,
                resourceKey: topologyDetails.resourceKey,
                publiclyAccessible: topologyDetails.publiclyAccessible,
              });
            } else {
              if (topologyDetails?.hasCompute === true) {
                if (topologyDetails.nodes) {
                  topologyDetails.nodes.forEach((node) => {
                    const nodeId = node.id;
                    const endpoint = node.endpoint;
                    const ports = processClusterPorts(node.ports);
                    const availabilityZone = node.availabilityZone;
                    const status = node.status;
                    const resourceName = topologyDetails.resourceName;
                    const resourceKey = topologyDetails.resourceKey;
                    const detailedHealth = node.detailedHealth;
                    const isJob = topologyDetails?.isJob;
                    const isMain = topologyDetails?.main;

                    nodes.push({
                      ...node,
                      id: nodeId,
                      nodeId: nodeId,
                      endpoint: endpoint,
                      ports: ports,
                      availabilityZone: availabilityZone,
                      status: status,
                      searchString: `${nodeId}${endpoint}${ports}${availabilityZone}${status}`,
                      resourceName: resourceName,
                      healthStatus: node.healthStatus,
                      resourceKey,
                      displayName: nodeId,
                      detailedHealth: detailedHealth,
                      storageSize: node.storageSize,
                      isJob,
                      isMain,
                    });
                  });
                } else {
                  // assume that the resource is serverless
                  if (
                    !resourceId.includes("r-obsrv") &&
                    data.status === "RUNNING"
                  ) {
                    nodes.push({
                      id: `${topologyDetails.resourceKey}-0`,
                      displayName: `serverless-${topologyDetails.resourceKey}`,
                      isServerless: true,
                      resourceKey: topologyDetails.resourceKey,
                      resourceId,
                    });
                  }
                }
              }
              globalEndpoints.others.push({
                resourceName: topologyDetails.resourceName,
                endpoint: topologyDetails.clusterEndpoint
                  ? topologyDetails.clusterEndpoint
                  : "",
                customDNSEndpoint: topologyDetails.customDNSEndpoint,
                resourceId: resourceId,
                resourceKey: topologyDetails.resourceKey,
                resourceHasCompute: topologyDetails.hasCompute,
                publiclyAccessible: topologyDetails.publiclyAccessible,
              });
            }
          }
        );

        // Initial value already has the main resource. So, if 'main' is true, then don't add any value to the Array

        let clusterPorts;
        if (data?.detailedNetworkTopology) {
          clusterPorts = Object.values(data.detailedNetworkTopology).reduce(
            (accumulator, topologyDetails) => {
              if (topologyDetails.main) return accumulator;
              return [
                ...accumulator,
                {
                  resourceName: topologyDetails?.resourceName,
                  ports: processClusterPorts(topologyDetails?.clusterPorts),
                },
              ];
            },
            [
              {
                resourceName: topologyDetails?.resourceName,
                ports: processClusterPorts(topologyDetails?.clusterPorts),
              },
            ]
          );
        }

        const additionalEndpoints = [];
        Object.values(data.detailedNetworkTopology || {}).forEach(
          (resource) => {
            additionalEndpoints.push({
              resourceName: resource.resourceName,
              additionalEndpoints: resource.additionalEndpoints,
            });
          }
        );

        const healthStatusPercent = calculateInstanceHealthPercentage(
          data?.detailedNetworkTopology,
          data?.status
        );

        const final = {
          resourceInstanceId: resourceInstanceId,
          resourceKey: topologyDetails?.resourceKey,
          region: data.region,
          cloudProvider: data.cloud_provider,
          status: data.status,
          createdAt: createdAt,
          modifiedAt: modifiedAt,
          networkType: data.network_type,
          autoscalingEnabled: data?.autoscalingEnabled
            ? data?.autoscalingEnabled
            : false,
          backupStatus: data?.backupStatus ? data?.backupStatus : {},
          highAvailability: data?.highAvailability
            ? data?.highAvailability
            : false,
          serverlessEnabled: data?.serverlessEnabled
            ? data?.serverlessEnabled
            : false,
          autoscaling: {
            currentReplicas: data?.currentReplicas,
            maxReplicas: data?.maxReplicas,
            minReplicas: data?.minReplicas,
          },
          instanceLoadStatus: data?.instanceLoadStatus,
          connectivity: {
            networkType: _.capitalize(data.network_type),
            additionalEndpoints: additionalEndpoints,
            clusterEndpoint: topologyDetails?.clusterEndpoint,
            nodeEndpoints: nodeEndpoints,
            ports: clusterPorts,
            availabilityZones: availabilityZones,
            publiclyAccessible: topologyDetails?.publiclyAccessible,
            privateNetworkCIDR: topologyDetails?.privateNetworkCIDR,
            privateNetworkId: topologyDetails?.privateNetworkID,
            globalEndpoints: globalEndpoints,
          },
          nodes: nodes,
          resultParameters: data.result_params,
          isLogsEnabled: isLogsEnabled,
          isMetricsEnabled: isMetricsEnabled,
          metricsSocketURL: metricsSocketURL,
          logsSocketURL: logsSocketURL,
          healthStatusPercent: healthStatusPercent,
          active: data?.active,
          mainResourceHasCompute: Boolean(topologyDetails?.hasCompute),
          customMetrics: customMetrics,
          customNetworkDetails,
          detailedNetworkTopology: data.detailedNetworkTopology || {},
          maintenanceTasks: data.maintenanceTasks || {},
          subscriptionLicense: data?.subscriptionLicense || {},
        };

        return final;
      },
    }
  );

  return resourceInstanceQuery;
}
