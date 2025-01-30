import { Box } from "@mui/material";
import NodeStatusTooltip from "./NodeStatusTooltip";
import StatusChip, {
  getChipStyles,
} from "src/components/StatusChip/StatusChip";

export const NodeStatus = (props) => {
  const { detailedHealth, isStopped } = props;
  const ConnectivityStatus = detailedHealth?.ConnectivityStatus;
  const DiskHealth = detailedHealth?.DiskHealth;
  const NodeHealth = detailedHealth?.NodeHealth;
  const ProcessHealth = detailedHealth?.ProcessHealth;
  const ProcessLiveness = detailedHealth?.ProcessLiveness;
  const detailedHealthStatus = [
    ConnectivityStatus,
    DiskHealth,
    NodeHealth,
    ProcessHealth,
    ProcessLiveness,
  ];

  return (
    <NodeStatusTooltip detailedHealth={detailedHealth}>
      <Box
        display="flex"
        alignItems="center"
        gap="6px"
        borderRadius="16px"
        p="5px 8px"
      >
        {detailedHealthStatus.map((status, index) => {
          const chipStyles = getChipStyles(isStopped ? "UNKNOWN" : status);

          if (isStopped) {
            return <StatusChip key={index} status="N/A" />;
          }

          return (
            <Box
              key={index}
              bgcolor={chipStyles.color || "gray"}
              width="8px"
              height="8px"
              borderRadius="50%"
              // sx={{
              //   animation: "blink 1s infinite",
              //   "@keyframes blink": {
              //     "0%, 100%": {
              //       opacity: 0.85,
              //     },
              //     "50%": {
              //       opacity: 0.25,
              //     },
              //   },
              // }}
            />
          );
        })}
      </Box>
    </NodeStatusTooltip>
  );
};
