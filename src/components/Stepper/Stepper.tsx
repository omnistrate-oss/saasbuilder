import {
  Step as MuiStep,
  StepConnector as MuiStepConnector,
  stepConnectorClasses,
  StepLabel as MuiStepLabel,
  stepLabelClasses,
  StepLabelProps,
  Stepper as MuiStepper,
  StepperProps,
  styled,
} from "@mui/material";

import ActiveIcon from "./ActiveIcon";
import BaseIcon from "./BaseIcon";
import CompleteIcon from "./CompleteIcon";
import ErrorIcon from "./ErrorIcon";

const StepIcon = (props) => {
  const { active, completed, error } = props;
  if (error) return <ErrorIcon />;
  if (completed) return <CompleteIcon />;
  if (active) return <ActiveIcon />;

  return <BaseIcon />;
};

const StepConnector = styled(MuiStepConnector)({
  [`&.${stepConnectorClasses.root}`]: {
    // Increase the width of the connector - when horizontal
    left: "calc(-50% + 12px)",
    right: "calc(50% + 12px)",

    [`& .${stepConnectorClasses.line}`]: {
      borderWidth: "2px",
    },
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#039855",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#039855",
    },
  },
  [`&.${stepConnectorClasses.disabled}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#EAECF0",
    },
  },
});

export const Stepper = styled((props: StepperProps) => <MuiStepper connector={<StepConnector />} {...props} />)({});

export const Step = styled(MuiStep)({});

export const StepLabel = styled((props: StepLabelProps) => <MuiStepLabel StepIconComponent={StepIcon} {...props} />)({
  [`& .${stepLabelClasses.label}`]: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 600,
    color: "#344054",
    cursor: "pointer",
  },

  [`& .${stepLabelClasses.active}`]: {
    color: "#6941C6",
  },
});
