import { Box, Stack, Tooltip, tooltipClasses, styled } from "@mui/material";

import { Text } from "components/Typography/Typography";

import CircleCheckIcon from "components/Icons/CircleCheck/CircleCheckIcon";
import CircleCrossIcon from "components/Icons/CircleCross/CircleCrossIcon";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#FFFFFF",
    padding: "12px",
    borderRadius: "8px",
    minWidth: "180px",
    boxShadow:
      "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
    border: "1px solid var(--Colors-Border-border-primary, #D0D5DD)",
  },
});

const NodeStatusTooltip = ({ detailedHealth, children }) => {
  const {
    ConnectivityStatus,
    DiskHealth,
    NodeHealth,
    ProcessHealth,
    ProcessLiveness,
  } = detailedHealth;

  const configurationList = [
    {
      text: "Connectivity Status",
      status: ConnectivityStatus,
    },
    {
      text: "Disk Health",
      status: DiskHealth,
    },
    {
      text: "Node Health",
      status: NodeHealth,
    },
    {
      text: "Process Health",
      status: ProcessHealth,
    },
    {
      text: "Process Liveness",
      status: ProcessLiveness,
    },
  ];

  return (
    <CustomTooltip
      // disableFocusListener
      title={
        <>
          <Text
            size="xsmall"
            weight="medium"
            color={"#344054"}
            sx={{ mb: "8px" }}
          >
            Health Status
          </Text>
          {configurationList.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              gap="12px"
              sx={{ paddingTop: "6px" }}
            >
              {item.status === "HEALTHY" ? (
                <CircleCheckIcon />
              ) : (
                <CircleCrossIcon
                  color={item.status === "UNHEALTHY" ? "#F44336" : "#808080"}
                />
              )}
              <Text size="xsmall" weight="regular" color="rgba(52, 64, 84, 1)">
                {item.text}
              </Text>
            </Stack>
          ))}
        </>
      }
      arrow
      sx={{
        "& .MuiTooltip-arrow": {
          "&:before": {
            backgroundColor: "#FFFFFF",
            border: "1px solid var(--Colors-Border-border-primary, #D0D5DD)",
            content: '""',
            display: "block",
            width: "100%",
            height: "100%",
            transform: "rotate(45deg)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          },
        },
      }}
    >
      <Box
        sx={{
          cursor: "pointer",
        }}
      >
        {children}
      </Box>
    </CustomTooltip>
  );
};

export default NodeStatusTooltip;
