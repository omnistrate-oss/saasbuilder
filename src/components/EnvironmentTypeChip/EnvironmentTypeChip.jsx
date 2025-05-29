import { ENVIRONMENT_TYPE_LABEL } from "src/constants/environmentTypes";
import useEnvironmentType from "src/hooks/useEnvironmentType";

import Chip from "../Chip/Chip";

function EnvironmentTypeChip() {
  const environmentType = useEnvironmentType();
  const environmentLabel = ENVIRONMENT_TYPE_LABEL[environmentType];
  const environmentStyles = getEnvironmentChipStyles(environmentType);

  return environmentLabel ? (
    <Chip
      bgColor={environmentStyles.bgColor}
      fontColor={environmentStyles.fontColor}
      borderColor={environmentStyles.fontColor}
      label={environmentType !== "PROD" ? `Environment ${environmentLabel} for Internal Use` : environmentLabel}
    />
  ) : (
    ""
  );
}

export default EnvironmentTypeChip;

function getEnvironmentChipStyles(envType) {
  const stylesMap = {
    DEV: {
      fontColor: "#0086C9",
      bgColor: "#E0F2FE",
    },
    PROD: {
      fontColor: "#32D583",
      bgColor: "#D1FADF",
    },
    QA: {
      fontColor: "#B692F6",
      bgColor: "#F4EBFF",
    },
    STAGING: {
      fontColor: "#FF692E",
      bgColor: "#FFE6D5",
    },
    CANARY: {
      fontColor: "#DC6803",
      bgColor: "#FEF0C7",
    },
    PRIVATE: {
      fontColor: "#DD2590",
      bgColor: "#FDF2FA",
    },
  };

  const defaultStyles = {
    fontColor: "#0086C9",
    bgColor: "#E0F2FE",
  };

  let styles = stylesMap[envType];

  if (!styles) {
    styles = defaultStyles;
  }

  return styles;
}
