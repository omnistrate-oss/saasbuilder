import { Box } from "@mui/material";
import Dot from "components/Dot/Dot";
import { Text } from "../Typography/Typography";

const LoadIndicator = () => {
  return (
    <Box display={"flex"} gap={"12px"}>
      <Box display={"flex"} gap={"8px"} alignItems={"center"}>
        <Dot color="#DADADA" size={8} component="div" />
        <Text size="small" weight="regular" color="#535862">
          Idle
        </Text>
      </Box>
      <Box display={"flex"} gap={"8px"} alignItems={"center"}>
        <Dot color="#26C68E" size={8} component="div" />
        <Text size="small" weight="regular" color="#535862">
          Normal
        </Text>
      </Box>
      <Box display={"flex"} gap={"8px"} alignItems={"center"}>
        <Dot color="#BC2D28" size={8} component="div" />
        <Text size="small" weight="regular" color="#535862">
          High
        </Text>
      </Box>
    </Box>
  );
};

export default LoadIndicator;
