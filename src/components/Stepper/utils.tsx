import Image from "next/image";
import StepperDefaultIcon from "./StepperDefaultIcon";
import StepperInProgressIcon from "./StepperInProgressIcon";
import StepperSuccessIcon from "./StepperSuccessIcon";
import { StepStepperProps } from "./StepStepper";
import { Text } from "../Typography/Typography";
import sandClock from "public/assets/images/cloud-account/sandclock.gif";

export const stateAccountConfigStepper = {
  trigger: "trigger",
  run: "run",
  check: "check",
};

type StepperSetpStatusProps = "trigger" | "run" | "check";

export const getStepperProps = (
  StepperSetpStatus: StepperSetpStatusProps
): StepStepperProps => {
  if (StepperSetpStatus === stateAccountConfigStepper.trigger) {
    return {
      step1: {
        title: "Trigger",
        icon: <StepperInProgressIcon />,
      },
      step2: {
        title: "Run",
        icon: <StepperDefaultIcon />,
      },
      step3: {
        title: "Check",
        icon: <StepperDefaultIcon />,
      },
    };
  }

  if (StepperSetpStatus === stateAccountConfigStepper.run) {
    return {
      step1: {
        title: "Trigger",
        icon: <StepperSuccessIcon />,
      },
      step2: {
        title: "Run",
        icon: <StepperInProgressIcon />,
      },
      step3: {
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
        title: "Run",
        icon: <StepperSuccessIcon />,
      },
      step3: {
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
      title: "Run",
      icon: <StepperDefaultIcon />,
    },
    step3: {
      title: "Check",
      icon: <StepperDefaultIcon />,
    },
  };
};

export const stepsDisconnectRunAccountConfig = [
  {
    label: (
      <Text size="small" weight="semibold" color="#414651">
        Validating Your Request
      </Text>
    ),
  },
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

export const stepsConnectRunAccountConfig = [
  {
    label: (
      <Text size="small" weight="semibold" color="#414651">
        Validating Your Request
      </Text>
    ),
  },
  {
    label: (
      <Text size="small" weight="semibold" color="#414651">
        Granting Permissions (manual step)
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
