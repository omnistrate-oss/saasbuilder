import EndpointCard from "./EndpointCard";
import { ContainerCard } from "../ResourceInstanceDetails/PropertyDetails";
import { Box } from "@mui/material";
import { getResourceInstanceChipStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceHealthStatus";
import StatusChip from "src/components/StatusChip/StatusChip";
import { FC } from "react";
import { getAdditionalEndpointsInstanceHealthStatus } from "./AdditionalEndPointInstanceHealthStatus";

type HealthStatus = "HEALTHY" | "UNHEALTHY" | "UNKNOWN" | "DEGRADED";

type Endpoint = {
  endpoint: string;
  openPorts: number[];
  networkingType: string;
  primary: boolean;
  healthStatus: HealthStatus;
};

type AdditionalEndpoints = Record<string, Endpoint>;

type CLIManagedConnectivityDetailsProps = {
  additionalEndpoints: {
    resourceName: string;
    additionalEndpoints: AdditionalEndpoints;
  }[];
};

const CLIManagedConnectivityDetails: FC<CLIManagedConnectivityDetailsProps> = ({ additionalEndpoints }) => {
  return additionalEndpoints.map(({ resourceName, additionalEndpoints: endpoints }) => {
    if (!endpoints) return null;

    const additionalEndpointsStatus = getAdditionalEndpointsInstanceHealthStatus(endpoints) as HealthStatus;

    const chipStylesAndLabel = getResourceInstanceChipStylesAndLabel(additionalEndpointsStatus);

    return (
      <ContainerCard
        title={resourceName}
        statusChip={<StatusChip {...chipStylesAndLabel} />}
        key={resourceName}
        marginTop="32px"
        contentBoxProps={{ padding: "12px 16px" }}
      >
        {Object.entries(endpoints).map(([name, endpoint], index) => (
          <Box key={index} marginTop={index > 0 ? "16px" : "0px"}>
            <EndpointCard
              isPrimary={endpoint.primary}
              endpointName={name}
              endpointURL={endpoint.endpoint}
              isPublic={endpoint.networkingType === "PUBLIC"}
              openPorts={endpoint.openPorts}
            />
          </Box>
        ))}
      </ContainerCard>
    );
  });
};

export default CLIManagedConnectivityDetails;
