import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Card from "components/Card/Card";
import ResourceConnectivityEndpoint from "./ConnectivityEndpoint";
import PropertyTable from "./PropertyTable";
import CLIManagedConnectivityDetails from "./CLIManagedConnectivityDetails";
import PropertyDetails from "../ResourceInstanceDetails/PropertyDetails";

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
    refetchInstance,
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

  const connectivitySummaryData = useMemo(() => {
    const dataFields = [];
    if (networkType) {
      dataFields.push({ label: "Network Type", value: networkType });
    }
    if (availabilityZones) {
      dataFields.push({
        label: "Availability zones",
        value: availabilityZones,
      });
    }

    dataFields.push({
      label: "Publicly Accessible",
      value: publiclyAccessible ? "Yes" : "No",
    });

    if (privateNetworkCIDR) {
      dataFields.push({
        label: "Private network CIDR",
        value: privateNetworkCIDR,
      });
    }

    if (privateNetworkId) {
      dataFields.push({
        label: "Private network ID",
        value: privateNetworkId,
      });
    }

    return dataFields;
  }, [
    networkType,
    availabilityZones,
    publiclyAccessible,
    privateNetworkCIDR,
    privateNetworkId,
  ]);

  useEffect(() => {
    refetchInstance();
  }, []);

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
    <>
      <PropertyDetails
        rows={{
          title: "Connectivity Details",
          desc: "Information about the resource instance connectivity options and network settings",
          rows: connectivitySummaryData,
          flexWrap: true,
        }}
        mt="20px"
      />
      <>
        {rows.length > 0 && (
          <Box>
            <PropertyTable data-testid="connectivity-table" rows={rows} />
          </Box>
        )}
      </>
    </>
  );
}

export default Connectivity;
