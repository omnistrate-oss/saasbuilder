import EndpointCard from "./EndpointCard";
import { ContainerCard } from "../ResourceInstanceDetails/PropertyDetails";
import { Box } from "@mui/material";

const CLIManagedConnectivityDetails = ({ additionalEndpoints }) => {
  return additionalEndpoints.map(
    ({ resourceName, additionalEndpoints: endpoints }) =>
      endpoints ? (
        <ContainerCard
          title={resourceName}
          key={resourceName}
          marginTop="32px"
          contentBoxProps={{ padding: "12px 16px" }}
        >
          {Object.entries(endpoints).map(([name, endpoint]: any, index) => (
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
      ) : null
  );
};

export default CLIManagedConnectivityDetails;
