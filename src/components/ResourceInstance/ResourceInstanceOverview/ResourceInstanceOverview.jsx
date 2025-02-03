import { Box, Stack } from "@mui/material";
import AwsLogo from "../../Logos/AwsLogo/AwsLogo";
import GcpLogo from "../../Logos/GcpLogo/GcpLogo";
import { Text } from "../../Typography/Typography";
import RegionIcon from "../../Region/RegionIcon";
import { getResourceInstanceStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceStatus";
import StatusChip from "src/components/StatusChip/StatusChip";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  TableCellCenterText,
} from "src/components/TableComponents/TableComponents";
import InstanceHealthStatusChip, {
  getInstanceHealthStatus,
} from "src/components/InstanceHealthStatusChip/InstanceHealthStautusChip";

function ResourceInstanceOverview(props) {
  const {
    serviceName,
    serviceLogoURL,
    subscriptionPlan,
    region,
    cloudProvider,
    status,
    isCliManagedResource,
    subscriptionOwner,
    detailedNetworkTopology,
    onViewNodesClick,
  } = props;

  const healthStatus = getInstanceHealthStatus(detailedNetworkTopology, status);

  const statusStylesAndLabel = getResourceInstanceStatusStylesAndLabel(status);

  return (
    <>
      <TableContainer
        sx={{
          mt: "10px",
          padding: "0px 0px",
        }}
      >
        <Table>
          <TableHead>
            <TableCellCenterText>
              <Text size="xsmall" weight="medium" color="#475467">
                Service Name
              </Text>
            </TableCellCenterText>
            <TableCellCenterText>
              <Text size="xsmall" weight="medium" color="#475467">
                Subscription Plan
              </Text>
            </TableCellCenterText>
            <TableCellCenterText>
              <Text size="xsmall" weight="medium" color="#475467">
                Subscription Owner
              </Text>
            </TableCellCenterText>
            <TableCellCenterText>
              <Text size="xsmall" weight="medium" color="#475467">
                Lifecycle Status
              </Text>
            </TableCellCenterText>
            <TableCellCenterText>
              <Text size="xsmall" weight="medium" color="#475467">
                Region
              </Text>
            </TableCellCenterText>
            <TableCellCenterText>
              <Text size="xsmall" weight="medium" color="#475467">
                Provider
              </Text>
            </TableCellCenterText>
            {!isCliManagedResource && (
              <TableCellCenterText>
                <Text size="xsmall" weight="medium" color="#475467">
                  Health Status
                </Text>
              </TableCellCenterText>
            )}
          </TableHead>

          <TableRow>
            <TableCell sx={{ py: "4px" }}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap="8px"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0px 1px 2px 0px #1018280D"
                  borderRadius="50%"
                  border="1px solid rgba(0, 0, 0, 0.08)"
                  overflow="hidden"
                  width="40px"
                  height="40px"
                  flexShrink={0}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    src={
                      serviceLogoURL ||
                      "/assets/images/dashboard/service/servicePlaceholder.png"
                    }
                    alt={serviceName}
                  />
                </Box>
                <Text size="small" weight="medium" color="#101828">
                  {serviceName}
                </Text>
              </Box>
            </TableCell>
            <TableCell sx={{ py: "4px" }}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Text size="small" weight="medium" color="#101828">
                  {subscriptionPlan}
                </Text>
              </Box>
            </TableCell>
            <TableCell sx={{ py: "4px" }}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Text size="small" weight="medium" color="#101828">
                  {subscriptionOwner}
                </Text>
              </Box>
            </TableCell>

            <TableCell sx={{ py: "4px" }}>
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"10px"}
              >
                {status ? (
                  <StatusChip status={status} {...statusStylesAndLabel} />
                ) : (
                  <Box sx={{ color: "#475467" }}>NA</Box>
                )}
              </Stack>
            </TableCell>

            <TableCell sx={{ py: "4px" }}>
              <Stack
                direction="row"
                justifyContent={"center"}
                alignItems="center"
              >
                <RegionIcon />
                <Box
                  component="span"
                  ml="5.5px"
                  fontWeight={500}
                  color="#101828"
                >
                  <Text size="small" weight="regular" color="#475467">
                    {region ?? "Global"}{" "}
                  </Text>
                </Box>
              </Stack>
            </TableCell>

            <TableCell sx={{ py: "4px" }}>
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"10px"}
              >
                {cloudProvider === "aws" && <AwsLogo />}
                {cloudProvider === "gcp" && <GcpLogo />}
                {!cloudProvider && (
                  <Box sx={{ color: "#475467" }}>Everywhere</Box>
                )}
              </Stack>
            </TableCell>
            {!isCliManagedResource && (
              <TableCell>
                <Stack
                  direction={"row"}
                  alignItems={"flex-end"}
                  justifyContent={"center"}
                >
                  <InstanceHealthStatusChip
                    computedHealthStatus={healthStatus}
                    detailedNetworkTopology={detailedNetworkTopology}
                    onViewNodesClick={onViewNodesClick}
                    openLinkInSameTab={true}
                  />
                </Stack>
              </TableCell>
            )}
          </TableRow>
        </Table>
      </TableContainer>
    </>
  );
}

export default ResourceInstanceOverview;
