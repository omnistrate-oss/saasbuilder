import Image from "next/image";

import sandClock from "public/assets/images/cloud-account/sandclock.gif";

import { Text } from "../Typography/Typography";

import StepperDefaultIcon from "./StepperDefaultIcon";
import StepperInProgressIcon from "./StepperInProgressIcon";
import StepperSuccessIcon from "./StepperSuccessIcon";
import { StepStepperProps } from "./StepStepper";

export const stateAccountConfigStepper = {
  trigger: "trigger",
  check: "check",
};

type StepperSetpStatusProps = "trigger" | "check";

export const getStepperProps = (StepperSetpStatus: StepperSetpStatusProps): StepStepperProps => {
  if (StepperSetpStatus === stateAccountConfigStepper.trigger) {
    return {
      step1: {
        title: "Trigger",
        icon: <StepperInProgressIcon />,
      },

      step2: {
        title: "Check",
        icon: <StepperDefaultIcon />,
      },
    };
  }

  if (StepperSetpStatus === stateAccountConfigStepper.check) {
    return {
      step1: {
        title: "Trigger",
        icon: <StepperSuccessIcon />,
      },
      step2: {
        title: "Check",
        icon: <StepperInProgressIcon />,
      },
    };
  }

  return {
    step1: {
      title: "Trigger",
      icon: <StepperDefaultIcon />,
    },

    step2: {
      title: "Check",
      icon: <StepperDefaultIcon />,
    },
  };
};

export const stepsDisconnectRunAccountConfig = [
  {
    label: (
      <Text size="small" weight="semibold" color="#414651">
        Disconnecting
      </Text>
    ),
  },
  {
    label: (
      <Text size="small" weight="semibold" color="#414651">
        Revoke permissions (manual step)
      </Text>
    ),
  },
];

export const CustomStepIcon = (props) => {
  const { active, completed } = props;

  return completed ? (
    <StepperSuccessIcon />
  ) : active ? (
    <Image src={sandClock} alt="sandwatch" width={26} />
  ) : (
    <StepperDefaultIcon />
  );
};
