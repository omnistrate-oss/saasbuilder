import { FC } from "react";
import { Box, Stack, styled } from "@mui/material";
import _ from "lodash";

import { colors } from "src/themeConfig";
import { SetState } from "src/types/common/reactGenerics";

const Button = styled("button")<{ enabled: boolean }>(({ enabled }) => ({
  fontSize: "14px",
  lineHeight: "20px",
  fontWeight: 600,
  backgroundColor: "#FFFFFF",
  border: "1px solid #D5D7DA",
  padding: "10px 9px",
  borderRadius: "8px",
  boxShadow: `0px 1px 2px 0px #0A0D120D, 0px -2px 0px 0px #0A0D120D inset`,
  color: "#414651",
  position: "relative",
  cursor: "pointer",
  fontFamily: "Inter",
  maxWidth: "320px",
  "&:after": {
    content: '""' /* Required to create the pseudo-element */,
    position: "absolute",
    top: "-5px" /* Create the gap (2px padding + 2px border width) */,
    left: "-5px",
    right: "-5px",
    bottom: "-5px",
    border: `2px solid ${enabled ? colors.success500 : "transparent"}` /* Hidden by default */,
    pointerEvents: "none" /* Prevent interactions with the pseudo-element */,
    borderRadius: "12px" /* Match the button's border-radius, if any */,
  },
}));

type FilterType = "failed" | "unhealthy" | "overloaded";

export type InstanceFilterStatus = Record<FilterType, boolean>;

const filterLabels: Record<FilterType, string> = {
  failed: "Failed deployments",
  unhealthy: "Unhealthy deployments",
  overloaded: "Overloaded deployments",
};

type InstanceFilterToggleProps = {
  type: FilterType;
  instanceCount: number;
  title: string;
  enabled: boolean;
  setFilterStatus: SetState<InstanceFilterStatus>;
};

export function getInitialFilterState(requiredFilters?: FilterType[]): InstanceFilterStatus {
  const filterState = {};

  if (!requiredFilters || requiredFilters.length === 0) {
    const filterTypes = ["failed", "unhealthy", "overloaded"];
    for (const filterType of filterTypes) {
      filterState[filterType] = false;
    }
  } else {
    for (const filterType of requiredFilters) {
      filterState[filterType] = false;
    }
  }
  //@ts-ignore
  return filterState;
}

export type FilterInstanceCount = Record<FilterType, number>;

const InstanceFilterToggle: FC<InstanceFilterToggleProps> = (props) => {
  const { enabled, instanceCount, title, setFilterStatus, type } = props;

  function handleFilterToggle() {
    setFilterStatus((prev) => {
      const updatedState: InstanceFilterStatus = _.cloneDeep(prev);

      Object.entries(updatedState).forEach(([filterType]) => {
        if (type === filterType) {
          updatedState[filterType] = !prev[filterType];
        } else {
          updatedState[filterType as FilterType] = false;
        }
      });

      return updatedState;
    });
  }

  return (
    <Button
      enabled={enabled}
      sx={{
        flex: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
      onClick={handleFilterToggle}
    >
      {title}
      <Box component="span" color={instanceCount > 0 ? "#D92D20" : "#717680"}>
        {instanceCount}
      </Box>
    </Button>
  );
};

type InstanceFiltersProps = {
  filterStatus: InstanceFilterStatus;
  setFilterStatus: SetState<InstanceFilterStatus>;
  filterInstanceCount: FilterInstanceCount;
};

const InstanceFilters: FC<InstanceFiltersProps> = (props) => {
  const { filterStatus, setFilterStatus, filterInstanceCount } = props;

  const filters = Object.keys(filterStatus).map((filterType) => ({
    type: filterType as FilterType,
    title: filterLabels[filterType],
  }));

  return (
    <Stack direction="row" justifyContent="center" display="flex" gap="20px" alignItems="stretch" width="100%">
      {filters.map((filter) => {
        return (
          <InstanceFilterToggle
            instanceCount={filterInstanceCount[filter.type]}
            enabled={filterStatus[filter.type]}
            title={filter.title}
            type={filter.type}
            key={filter.type}
            setFilterStatus={setFilterStatus}
          />
        );
      })}
    </Stack>
  );
};

export default InstanceFilters;
