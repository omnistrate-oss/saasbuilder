import { Box, Stack, styled } from "@mui/material";
import AwsLogo from "../../Logos/AwsLogo/AwsLogo";
import GcpLogo from "../../Logos/GcpLogo/GcpLogo";
import { Text } from "../../Typography/Typography";
import RegionIcon from "../../Region/RegionIcon";
import { getResourceInstanceStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceStatus";
import StatusChip from "src/components/StatusChip/StatusChip";
import {
  Table,
  TableHead,
  TableCell as UnstyledTableCell,
  TableRow,
  TableContainer,
  TableCellCenterText,
} from "src/components/TableComponents/TableComponents";
import InstanceHealthStatusChip, {
  getInstanceHealthStatus,
} from "src/components/InstanceHealthStatusChip/InstanceHealthStautusChip";
import { colors } from "src/themeConfig";

const TableHeading = (props) => {
  return (
    <Text size="xsmall" weight="semibold" color="#717680">
      {props.children}
    </Text>
  );
};

const StyledTableCell = styled(UnstyledTableCell)({
  padding: "14px 24px",
});

const TableCell = (props) => {
  const { children, containerStyles = {} } = props;
  return (
    <StyledTableCell>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ ...containerStyles }}
      >
        {children}
      </Stack>
    </StyledTableCell>
  );
};
const CellContentText = (props) => {
  const { children, ...restProps } = props;
  return (
    <Text size="small" weight="regular" color={colors.gray600} {...restProps}>
      {children}
    </Text>
  );
};

const ServiceLogoImg = styled("img")({
  height: "40px",
  width: "40px",
  objectFit: "cover",
  borderRadius: "50%",
});

function ResourceInstanceOverview(props) {
  const {
    // resourceInstanceId,
    region,
    cloudProvider,
    status,
    // isResourceBYOA,
    isCliManagedResource,
    subscriptionOwner,
    detailedNetworkTopology,
    onViewNodesClick,
    serviceName,
    productTierName,
    serviceLogoURL,
  } = props;

  //let sectionLabel = "Resource";
  // if (isResourceBYOA) {
  //   sectionLabel = "Account";
  // }

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
            {/* <TableCellCenterText>
              <TableHeading>{`${sectionLabel} Instance ID`} </TableHeading>
            </TableCellCenterText> */}
            <TableCellCenterText>
              <TableHeading>Service Name</TableHeading>
            </TableCellCenterText>
            <TableCellCenterText>
              <TableHeading>Subscription Plan</TableHeading>
            </TableCellCenterText>
            <TableCellCenterText>
              <TableHeading>Subscription Owner</TableHeading>
            </TableCellCenterText>
            <TableCellCenterText>
              <TableHeading>Lifecycle Status</TableHeading>
            </TableCellCenterText>
            <TableCellCenterText>
              <TableHeading>Region</TableHeading>
            </TableCellCenterText>
            <TableCellCenterText>
              <TableHeading>Cloud Provider</TableHeading>
            </TableCellCenterText>
            {!isCliManagedResource && (
              <TableCellCenterText>
                <TableHeading>Health Status</TableHeading>
              </TableCellCenterText>
            )}
          </TableHead>

          <TableRow>
            <TableCell containerStyles={{ gap: "12px" }}>
              {serviceLogoURL && (
                <ServiceLogoImg
                  src={serviceLogoURL}
                  alt={`${serviceName}-logo`}
                />
              )}
              <CellContentText>{serviceName}</CellContentText>
            </TableCell>
            <TableCell>
              <CellContentText>{productTierName}</CellContentText>
            </TableCell>
            <TableCell>
              <CellContentText>{subscriptionOwner}</CellContentText>
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
