import { EnvironmentType } from "src/types/common/enums";

export const ENVIRONMENT_TYPES: Record<EnvironmentType, string> = {
  DEV: "DEV",
  PROD: "PROD",
  QA: "QA",
  STAGING: "STAGING",
  CANARY: "CANARY",
  PRIVATE: "PRIVATE",
};

export const ENVIRONMENT_TYPE_LABEL: Record<EnvironmentType, string> = {
  DEV: "Dev",
  PROD: "Production",
  QA: "QA",
  STAGING: "Staging",
  CANARY: "Canary",
  PRIVATE: "Private",
};
