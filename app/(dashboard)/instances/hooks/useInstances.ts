import { useQuery } from "@tanstack/react-query";
// import { getAllResourceInstances } from "src/api/resourceInstance";

const useInstances = (queryOptions = {}) => {
  const instancesQuery = useQuery(
    ["instances"],
    async () => {
      // return getAllResourceInstances();
      return {
        resourceInstances: [
          {
            id: "instance-zwwxskqng",
            status: "RUNNING",
            cloud_provider: "aws",
            region: "ap-south-1",
            network_type: "PUBLIC",
            created_at: "2025-01-09T04:25:46Z",
            last_modified_at: "2025-01-09T04:30:10Z",
            active: true,
            result_params: {
              username: "username",
            },
            detailedNetworkTopology: {
              "r-VkrlFG7v6C": {
                resourceName: "Postgres",
                resourceKey: "postgres",
                clusterEndpoint:
                  "r-vkrlfg7v6c.instance-zwwxskqng.hc-js2tdp472.ap-south-1.aws.zn6amacsp.dev",
                hasCompute: true,
                customDNSEndpoint: {
                  enabled: false,
                },
                nodes: [
                  {
                    endpoint:
                      "postgres-0.instance-zwwxskqng.hc-js2tdp472.ap-south-1.aws.zn6amacsp.dev",
                    availabilityZone: "ap-south-1c",
                    ports: [5432],
                    id: "postgres-0",
                    healthStatus: "HEALTHY",
                    detailedHealth: {
                      ProcessHealth: "HEALTHY",
                      ProcessLiveness: "HEALTHY",
                      ConnectivityStatus: "HEALTHY",
                      DiskHealth: "HEALTHY",
                      NodeHealth: "HEALTHY",
                      LoadStatus: "LOAD_IDLE",
                      LoadHealth: "POD_IDLE",
                    },
                    status: "RUNNING",
                    storageSize: 10,
                  },
                ],
                clusterPorts: [5432],
                main: true,
                networkingType: "PUBLIC",
                publiclyAccessible: true,
                allowedIPRanges: ["0.0.0.0/0"],
                privateNetworkCIDR: "177.0.0.0/16",
                resourceInstanceMetadata: null,
              },
              "r-obsrvptrbhup1geai": {
                resourceName: "Omnistrate Observability",
                resourceKey: "omnistrateobserv",
                clusterEndpoint:
                  "a70ybcff3v:kdkp1rfh@streamer.hc-js2tdp472.ap-south-1.aws.zn6amacsp.dev",
                hasCompute: false,
                customDNSEndpoint: {
                  enabled: false,
                },
                clusterPorts: [8080],
                main: false,
                networkingType: "PUBLIC",
                publiclyAccessible: true,
                allowedIPRanges: ["0.0.0.0/0"],
                privateNetworkCIDR: "177.0.0.0/16",
                resourceInstanceMetadata: null,
              },
            },
            productTierFeatures: {
              LOGS: {
                enabled: true,
                featureName: "LOGS",
                label: ["ONLINE"],
                scope: "CUSTOMER",
              },
              METRICS: {
                enabled: true,
                featureName: "METRICS",
                label: ["ONLINE"],
                scope: "CUSTOMER",
              },
            },
            createdByUserId: "user-T0ZUgEqG7o",
            createdByUserName: "Nihal",
            highAvailability: false,
            autoscalingEnabled: true,
            minReplicas: "1",
            maxReplicas: "5",
            currentReplicas: "1",
            serverlessEnabled: false,
            instanceLoadStatus: "POD_IDLE",
            subscriptionId: "sub-KlQVtli4Z9",
          },
        ],
      };
    },
    {
      select: (data) => {
        return data.resourceInstances;
      },
      ...queryOptions,
    }
  );
  return instancesQuery;
};

export default useInstances;
