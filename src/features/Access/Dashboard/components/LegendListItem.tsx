import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Stack,
  linearProgressClasses,
  styled,
} from "@mui/material";
import { FC } from "react";
import AWSIcon from "src/components/Icons/CloudProviders/AWSLogo";
import GcpIcon from "src/components/Icons/CloudProviders/GCPLogo";
import RegionIcon from "src/components/Region/RegionIcon";
import { Text } from "src/components/Typography/Typography";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import { CloudProvider } from "src/types/common/enums";

type LegendListItemProps = {
  numInstances: number;
  percent: number;
  cloudProvider: CloudProvider;
  color: string;
  region: string;
};

const StyledProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "barColor",
})<LinearProgressProps & { barColor: string }>(({ barColor }) => {
  return {
    height: "8px",
    borderRadius: "8px",
    backgroundColor: "#E4E7EC",
    [`& .${linearProgressClasses.bar1Determinate}`]: {
      borderRadius: "8px",
      backgroundColor: barColor,
    },
  };
});

const LegendListItem: FC<LegendListItemProps> = (props) => {
  const { color, cloudProvider, numInstances, percent, region } = props;

  const icon = cloudProviderLogoMap[cloudProvider] ?? <RegionIcon />;

  return (
    <Stack direction="row" gap="16px" alignItems="center">
      <Box flexShrink={0} flexGrow={0} width="37px">
        {icon}
      </Box>
      <Box>
        <Text size="small" weight="medium" color="#344054">
          {region || "Global"}
        </Text>
        <Stack direction="row" alignItems="center" gap="12px">
          <StyledProgressBar
            barColor={color}
            variant="determinate"
            value={percent}
            sx={{ width: "92px" }}
          />{" "}
          <Text
            size="small"
            weight="medium"
            color="#344054"
            sx={{ whiteSpace: "nowrap" }}
          >
            {percent}% ({numInstances})
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
};

export default LegendListItem;
