import { FC, ReactNode } from "react";
import {
  InstanceComputedHealthStatus,
  ResourceInstanceNode,
  ResourceInstanceNetworkTopology,
} from "src/types/resourceInstance";
import StatusChip from "../StatusChip/StatusChip";
import { getResourceInstanceChipStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceHealthStatus";
import AlertTriangle from "../Icons/AlertTriangle/AlertTriangle";
import { chipCategoryColors } from "src/constants/statusChipStyles";
import { BlackTooltip } from "../Tooltip/Tooltip";
import { Box, Stack, styled } from "@mui/material";
import CircleCheckOutlineIcon from "../Icons/CircleCheckOutline/CircleCheckOutline";
import { Text } from "../Typography/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import _ from "lodash";

function getInstanceNodes(
  detailedNetworkTopology: Record<string, ResourceInstanceNetworkTopology> = {}
) {
  let nodes: ResourceInstanceNode[] = [];

  Object.entries(detailedNetworkTopology).forEach(([, topologyDetails]) => {
    if (topologyDetails.hasCompute) {
      const nodesList = topologyDetails.nodes || [];
      nodes.push(...nodesList);
    }
  });
  //@ts-ignore
  nodes = nodes.filter((node) => !node.isServerless);

  nodes = _.uniqBy(nodes, "id");

  return nodes;
}

export function getInstanceHealthStatus(
  detailedNetworkTopology: Record<string, ResourceInstanceNetworkTopology> = {},
  instanceLifecycleStatus: string | undefined
): InstanceComputedHealthStatus {
  let isCLIManagedResource = false;

  //Return UNKOWN status for CLI Managed resources
  if (detailedNetworkTopology) {
    const mainResource = Object.values(detailedNetworkTopology).find(
      (topologyDetails) => topologyDetails.main === true
    );

    if (
      mainResource &&
      CLI_MANAGED_RESOURCES.includes(mainResource.resourceType as string)
    ) {
      isCLIManagedResource = true;
    }
  }

  if (isCLIManagedResource) return "UNKNOWN";

  //return N/A for Stopped instances
  if (instanceLifecycleStatus === "STOPPED") return "NA";

  const nodes: ResourceInstanceNode[] = getInstanceNodes(
    detailedNetworkTopology
  );

  let computedHealthStatus: InstanceComputedHealthStatus = "UNKNOWN";

  if (nodes.length > 0) {
    if (nodes.every((node) => node.healthStatus === "UNKNOWN")) {
      //health status is unknown if all nodes have unknown health status
      computedHealthStatus = "UNKNOWN";
      //
    } else {
      //ignore unknown nodes and calculate health status
      const nonUnknownHealthNodes = nodes.filter(
        (node) => node.healthStatus !== "UNKNOWN"
      );

      //healhy if all nodes are healthy
      if (
        nonUnknownHealthNodes.every((node) => node.healthStatus === "HEALTHY")
      ) {
        computedHealthStatus = "HEALTHY";
      } else if (
        nonUnknownHealthNodes.every((node) => node.healthStatus === "UNHEALTHY")
      ) {
        computedHealthStatus = "UNHEALTHY";
      } else {
        computedHealthStatus = "DEGRADED";
      }
    }
  } else {
    if (
      instanceLifecycleStatus === "RUNNING" ||
      instanceLifecycleStatus === "READY"
    ) {
      computedHealthStatus = "HEALTHY";
    }
  }

  return computedHealthStatus;
}

const List = styled("ul")({
  margin: "0px",
  marginTop: "6px",
  listStyleType: "disc",
  padding: "0px",
  paddingLeft: "22px",
});

const ListItem = styled("li")({
  fontSize: "12px",
  lineHeight: "18px",
  fontWeight: 400,
});

const UnstyledLink = styled(Link)({
  textDecoration: "none",
});

type InstanceHealthStatusChipProps = {
  detailedNetworkTopology: Record<string, ResourceInstanceNetworkTopology>;
  onViewNodesClick?: () => void;
  viewNodesLink?: string;
  computedHealthStatus: InstanceComputedHealthStatus;
  openLinkInSameTab?: boolean;
};

const InstanceHealthStatusChip: FC<InstanceHealthStatusChipProps> = (props) => {
  const {
    detailedNetworkTopology,
    onViewNodesClick,
    viewNodesLink,
    computedHealthStatus,
    openLinkInSameTab = false,
  } = props;

  const nodes = getInstanceNodes(detailedNetworkTopology);

  const chipStylesAndLabel =
    getResourceInstanceChipStylesAndLabel(computedHealthStatus);

  let startIcon: ReactNode = "";
  if (computedHealthStatus === "DEGRADED") {
    startIcon = <AlertTriangle color={chipCategoryColors.pending.color} />;
  } else if (computedHealthStatus === "UNHEALTHY") {
    startIcon = <AlertTriangle color={chipCategoryColors.failed.color} />;
  }

  let tooltipContent: ReactNode;

  if (computedHealthStatus === "HEALTHY") {
    tooltipContent = (
      <Stack direction="row" alignItems="center" gap="7px">
        <CircleCheckOutlineIcon />
        <Text size="xsmall" weight="semibold" color="white">
          {" "}
          All nodes are healthy
        </Text>
      </Stack>
    );
  }

  if (
    computedHealthStatus === "DEGRADED" ||
    computedHealthStatus === "UNHEALTHY"
  ) {
    const numNodesToDisplay = 3;
    let shouldShowEllipsis = false;
    //all nodes are
    const unhealthyNodes = nodes.filter(
      (node) => node.healthStatus === "UNHEALTHY"
    );
    let visibleNodes = unhealthyNodes;

    if (unhealthyNodes.length > numNodesToDisplay) {
      shouldShowEllipsis = true;
      visibleNodes = visibleNodes.filter(
        (node, index) => index < numNodesToDisplay
      );
    }

    const viewAllNodesButton = (
      <Stack
        display="inline-flex"
        direction="row"
        alignItems="center"
        marginTop="12px"
        sx={{ cursor: "pointer" }}
      >
        <Text
          size="xsmall"
          weight="medium"
          color="white"
          onClick={() => {
            onViewNodesClick?.();
          }}
        >
          View All
        </Text>
        <ChevronRightIcon sx={{ color: "white" }} />
      </Stack>
    );

    tooltipContent = (
      <Box>
        <Stack direction="row" alignItems="center" gap="7px">
          <AlertTriangle color="#F79009" />
          <Text size="xsmall" weight="semibold" color="white">
            Unhealthy nodes
          </Text>
        </Stack>
        <List>
          {visibleNodes.map((node) => (
            <ListItem key={node.id}>{node.id}</ListItem>
          ))}
        </List>
        {shouldShowEllipsis && <Box textAlign="center">...</Box>}

        {/* {unhealthyNodes.length > numNodesToDisplay && ( */}
        {viewNodesLink ? (
          <UnstyledLink
            href={viewNodesLink}
            target={openLinkInSameTab ? "_self" : "_blank"}
          >
            {viewAllNodesButton}
          </UnstyledLink>
        ) : (
          viewAllNodesButton
        )}
      </Box>
    );
  }

  if (computedHealthStatus === "UNKNOWN") {
    tooltipContent = (
      <Stack direction="row" alignItems="center" gap="7px">
        <AlertTriangle color="#bababa" />
        <Text size="xsmall" weight="semibold" color="white">
          Nodes health status unknown
        </Text>
      </Stack>
    );
  }

  return (
    <BlackTooltip
      title={tooltipContent}
      visible={computedHealthStatus !== "NA"}
    >
      <Box display="inline-block">
        <StatusChip {...chipStylesAndLabel} startIcon={startIcon} />
      </Box>
    </BlackTooltip>
  );
};

export default InstanceHealthStatusChip;
