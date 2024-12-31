import { Box } from "@mui/material";
import { useMemo } from "react";
import PropertyTable from "./PropertyTable";
import CustomDNS from "./CustomDNS";

function ResourceCustomDNS(props) {
  const {
    globalEndpoints,
    context,
    addCustomDNSMutation,
    removeCustomDNSMutation,
    accessQueryParams,
    refetchInstance,
  } = props;

  const primaryResourceName = globalEndpoints?.primary?.resourceName;
  const primaryResourceEndpoint = globalEndpoints?.primary?.endpoint;

  const [otherResourceFilteredEndpoints] = useMemo(() => {
    const otherEndpoints = globalEndpoints?.others;

    const otherResourceFilteredEndpoints = [];

    otherEndpoints?.forEach((endpointData) => {
      const { resourceName, endpoint } = endpointData;
      if (resourceName && endpoint) {
        // filter out omnistrate observability
        if (resourceName === "Omnistrate Observability") {
          return;
        }
        otherResourceFilteredEndpoints.push(endpointData);
      }
    });
    return [otherResourceFilteredEndpoints];
  }, [globalEndpoints]);

  const rows = useMemo(() => {
    let sectionLabel = "Resource";

    if (context === "inventory") {
      sectionLabel = "Service Component";
    }

    const res = [];

    if (primaryResourceName || otherResourceFilteredEndpoints?.length > 0) {
      const customDNSEndpointName =
        globalEndpoints?.primary?.customDNSEndpoint?.name ?? "";

      res.push({
        label: primaryResourceName,
        description: `The global endpoint of the ${sectionLabel.toLowerCase()}`,
        valueType: "custom",
        value: (
          <>
            {primaryResourceName && (
              <CustomDNS
                resourceName={`${primaryResourceName} ${customDNSEndpointName}`}
                customDNSData={globalEndpoints?.primary?.customDNSEndpoint}
                accessQueryParams={accessQueryParams}
                resourceKey={globalEndpoints?.primary?.resourceKey}
                resourceId={globalEndpoints?.primary?.resourceId}
                refetchInstance={refetchInstance}
                resourceHasCompute={
                  globalEndpoints?.primary?.resourceHasCompute
                }
              />
            )}
          </>
        ),
      });
    }

    if (otherResourceFilteredEndpoints?.length > 0) {
      otherResourceFilteredEndpoints.forEach(
        ({
          resourceName,
          endpoint,
          resourceKey,
          resourceId,
          resourceHasCompute,
          customDNSEndpoint,
        }) => {
          const customDNSEndpointName = customDNSEndpoint?.name ?? "";
          if (resourceName && endpoint) {
            res.push({
              label: resourceName,
              description: `The global endpoint of the ${sectionLabel.toLowerCase()}`,
              valueType: "custom",
              value: (
                <CustomDNS
                  resourceName={`${primaryResourceName} ${customDNSEndpointName}`}
                  customDNSData={customDNSEndpoint}
                  accessQueryParams={accessQueryParams}
                  resourceKey={resourceKey}
                  resourceId={resourceId}
                  refetchInstance={refetchInstance}
                  resourceHasCompute={resourceHasCompute}
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
    globalEndpoints?.primary?.customDNSEndpoint,
    addCustomDNSMutation,
    removeCustomDNSMutation,
  ]);

  return (
    rows.length > 0 && (
      <Box paddingTop={context === "fleet" ? "-10px" : "22px"}>
        <PropertyTable data-testid="connectivity-table" rows={rows} />
      </Box>
    )
  );
}

export default ResourceCustomDNS;
