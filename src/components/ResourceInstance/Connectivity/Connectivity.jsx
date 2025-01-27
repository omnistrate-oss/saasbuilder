import { Box, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Card from "components/Card/Card";
import { Text } from "components/Typography/Typography";
import ResourceConnectivityEndpoint from "./ConnectivityEndpoint";
import PropertyTable from "./PropertyTable";
import CLIManagedConnectivityDetails from "./CLIManagedConnectivityDetails";

function Connectivity(props) {
  const {
    networkType,
    ports,
    publiclyAccessible,
    privateNetworkCIDR,
    privateNetworkId,
    globalEndpoints,
    context,
    nodes,
    additionalEndpoints,
  } = props;

  const [availabilityZones, setAvailabilityZones] = useState("");
  const primaryResourceName = globalEndpoints?.primary?.resourceName;
  const primaryResourceEndpoint = globalEndpoints?.primary?.endpoint;
  const primaryResourcePorts = ports?.[0];

  const [otherResourceFilteredPorts, otherResourceFilteredEndpoints] =
    useMemo(() => {
      const otherResourcePorts = ports?.slice(1) ?? [];
      const otherEndpoints = globalEndpoints?.others;

      const otherResourceFilteredPorts = [];
      const otherResourceFilteredEndpoints = [];

      otherEndpoints?.forEach((endpointData) => {
        const { resourceName, endpoint } = endpointData;
        if (resourceName && endpoint) {
          const matchingResourcePort = otherResourcePorts.find(
            (port) => port.resourceName === resourceName && port.ports
          );
          if (matchingResourcePort) {
            // filter out omnistrate observability
            if (resourceName === "Omnistrate Observability") {
              return;
            }
            otherResourceFilteredPorts.push(matchingResourcePort);
            otherResourceFilteredEndpoints.push(endpointData);
          }
        }
      });
      return [otherResourceFilteredPorts, otherResourceFilteredEndpoints];
    }, [ports, globalEndpoints]);

  useEffect(() => {
    let availabilityZone = "";
    const nodeAvailabilityZone = [];
    nodes.map((node) => {
      if (!nodeAvailabilityZone.includes(node.availabilityZone)) {
        if (availabilityZone) {
          if (node?.availabilityZone) {
            availabilityZone = availabilityZone + "," + node.availabilityZone;
          }
        } else availabilityZone = node.availabilityZone;
        nodeAvailabilityZone.push(node.availabilityZone);
      }
    });
    setAvailabilityZones(availabilityZone);
  }, [nodes]);

  const rows = useMemo(() => {
    let sectionLabel = "Resource";

    if (context === "inventory") {
      sectionLabel = "Service Component";
    }

    const res = [];

    if (
      (primaryResourceName && primaryResourceEndpoint) ||
      otherResourceFilteredEndpoints?.length > 0
    ) {
      res.push({
        label: primaryResourceName,
        description: `The global endpoint of the ${sectionLabel.toLowerCase()}`,
        valueType: "custom",
        value: (
          <>
            {primaryResourceName &&
              primaryResourceEndpoint &&
              primaryResourcePorts && (
                <ResourceConnectivityEndpoint
                  isPrimaryResource={true}
                  endpointURL={primaryResourceEndpoint}
                  resourceName={primaryResourceName}
                  viewType="endpoint"
                  ports={primaryResourcePorts?.ports}
                  resourceHasCompute={
                    globalEndpoints?.primary?.resourceHasCompute
                  }
                  customDNSData={globalEndpoints?.primary?.customDNSEndpoint}
                />
              )}
          </>
        ),
      });
    }

    if (otherResourceFilteredEndpoints?.length > 0) {
      otherResourceFilteredEndpoints.forEach(
        ({ resourceName, endpoint, resourceId, customDNSEndpoint }) => {
          if (resourceName && endpoint && otherResourceFilteredPorts) {
            res.push({
              label: resourceName,
              description: `The global endpoint of the ${sectionLabel.toLowerCase()}`,
              valueType: "custom",
              value: (
                <ResourceConnectivityEndpoint
                  key={resourceId}
                  isPrimaryResource={false}
                  resourceName={resourceName}
                  ports={otherResourceFilteredPorts}
                  viewType="endpoint"
                  endpointURL={endpoint}
                  containerStyles={{ marginTop: "16px" }}
                  customDNSData={customDNSEndpoint}
                />
              ),
            });
          }
        }
      );
    }

    return res;
  }, [
    context,
    primaryResourceName,
    primaryResourceEndpoint,
    otherResourceFilteredEndpoints,
    primaryResourcePorts,
    otherResourceFilteredPorts,
    globalEndpoints?.primary?.customDNSEndpoint,
  ]);

  if (additionalEndpoints.some((el) => el.additionalEndpoints)) {
    return (
      <Card
        sx={{
          marginTop: "32px",
          padding: "12px",
          borderRadius: "8px",
        }}
      >
        <CLIManagedConnectivityDetails
          additionalEndpoints={additionalEndpoints}
        />
      </Card>
    );
  }

  return (
    <Card
      sx={{
        marginTop: "32px",
        padding: "12px",
        borderRadius: "8px",
      }}
    >
      <Card
        sx={{
          padding: "12px",
          borderRadius: "8px",
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottom: "1px solid #E4E7EC",
            padding: "12px 0px",
            marginBottom: "12px",
          }}
          alignItems="center"
        >
          <Box>
            <Text size="small" weight="semibold" color="rgba(105, 65, 198, 1)">
              {"Connectivity Details Info"}
            </Text>
            <Text size="small" weight="regular" color="#475467">
              {
                "Information about the resource instance connectivity options and network settings"
              }
            </Text>
          </Box>
        </Stack>
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Box
            flex="1"
            p="16px 24px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Text size="small" weight="semibold" color="#101828">
              {"Network type"}
            </Text>
            <Text size="small" weight="regular" color="#475467">
              {networkType}
            </Text>
          </Box>
          {availabilityZones && (
            <Box
              flex="1"
              borderLeft="1px solid #EAECF0"
              p="16px 24px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Text size="small" weight="semibold" color="#101828">
                {"Availability zones"}
              </Text>
              <Text size="small" weight="regular" color="#475467">
                {availabilityZones}
              </Text>
            </Box>
          )}
          <Box
            flex="1"
            borderLeft="1px solid #EAECF0"
            p="16px 24px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Text size="small" weight="semibold" color="#101828">
              {"Publicly accessible"}
            </Text>
            <Text size="small" weight="regular" color="#475467">
              {publiclyAccessible ? "Yes" : "No"}
            </Text>
          </Box>
          {privateNetworkCIDR && (
            <Box
              flex="1"
              borderLeft="1px solid #EAECF0"
              p="16px 24px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Text size="small" weight="semibold" color="#101828">
                {"Private network CIDR"}
              </Text>
              <Text size="small" weight="regular" color="#475467">
                {privateNetworkCIDR}
              </Text>
            </Box>
          )}
          {privateNetworkId && (
            <Box
              flex="1"
              borderLeft="1px solid #EAECF0"
              p="16px 24px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Text size="small" weight="semibold" color="#101828">
                {"Private network ID"}
              </Text>
              <Text size="small" weight="regular" color="#475467">
                {privateNetworkId}
              </Text>
            </Box>
          )}
        </Box>
      </Card>
      <>
        {rows.length > 0 && (
          <Box>
            <PropertyTable data-testid="connectivity-table" rows={rows} />
          </Box>
        )}
      </>
    </Card>
  );
}

export default Connectivity;
