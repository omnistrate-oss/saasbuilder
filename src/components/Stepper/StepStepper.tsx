import { Box, Stack } from "@mui/material";
import { Text } from "../Typography/Typography";
import StepperDefaultIcon from "./StepperDefaultIcon";

export type StepStepperProps = {
  step1: {
    title: string;
    titleColor?: string;
    description?: string;
    descriptionColor?: string;
    icon?: React.ReactNode;
  };
  step2: {
    title: string;
    titleColor?: string;
    description?: string;
    descriptionColor?: string;
    icon?: React.ReactNode;
  };
  step3: {
    title: string;
    titleColor?: string;
    description?: string;
    descriptionColor?: string;
    icon?: React.ReactNode;
  };
  stepperColor?: string;
};

const StepStepper: React.FC<StepStepperProps> = ({
  step1,
  step2,
  step3,
  stepperColor,
}) => {
  return (
    <Stack
      position="relative"
      direction="row"
      gap="16px"
      alignItems="center"
      width="100%"
      mx="auto"
    >
      {/* Connector Line */}
      <Box
        height="2px"
        bgcolor={stepperColor || "#E9EAEB"}
        position="absolute"
        width="calc(100% - 68px)" // Covers from step1 to step3
        left="34px" // Start at step1's center
        right="24px"
        top="11px" // Align with icon center
        zIndex={1}
      />

      {/* Step 1 */}
      <Stack flex="1" alignItems="left">
        <Box
          zIndex="10"
          width="24px"
          height="24px"
          display="flex"
          marginLeft={"12px"}
          justifyContent="center"
          sx={{
            background: "white",
            borderRadius: "50%",
          }}
        >
          {step1.icon || <StepperDefaultIcon />}
        </Box>
        <Text
          size="small"
          weight="semibold"
          color={step1.titleColor || "#414651"}
          sx={{ textAlign: "left", mt: "12px" }}
        >
          {step1.title}
        </Text>
        <Text
          size="small"
          weight="regular"
          color={step1.descriptionColor || "#535862"}
          sx={{ textAlign: "left" }}
        >
          {step1.description}
        </Text>
      </Stack>

      {/* Step 2 */}
      <Stack flex="1" alignItems="center">
        <Box
          zIndex="10"
          width="24px"
          height="24px"
          display="flex"
          justifyContent="center"
          sx={{
            background: "white",
            borderRadius: "50%",
          }}
        >
          {step2.icon || <StepperDefaultIcon />}
        </Box>
        <Text
          size="small"
          weight="semibold"
          color={step2.titleColor || "#414651"}
          sx={{ textAlign: "center", mt: "12px" }}
        >
          {step2.title}
        </Text>
        <Text
          size="small"
          weight="regular"
          color={step2.descriptionColor || "#535862"}
          sx={{ textAlign: "center" }}
        >
          {step2.description}
        </Text>
      </Stack>

      {/* Step 3 */}
      <Stack flex="1" alignItems="flex-end">
        <Box
          zIndex="10"
          width="24px"
          height="24px"
          display="flex"
          marginRight={"10px"}
          justifyContent="flex-end"
          sx={{
            background: "white",
            borderRadius: "50%",
          }}
        >
          {step3.icon || <StepperDefaultIcon />}
        </Box>
        <Text
          size="small"
          weight="semibold"
          color={step3.titleColor || "#414651"}
          sx={{ textAlign: "right", mt: "12px" }}
        >
          {step3.title}
        </Text>
        <Text
          size="small"
          weight="regular"
          color={step3.descriptionColor || "#535862"}
          sx={{ textAlign: "right" }}
        >
          {step3.description}
        </Text>
      </Stack>
    </Stack>
  );
};

export default StepStepper;
