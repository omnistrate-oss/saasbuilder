import { ElementType, FC, ReactNode } from "react";
import { Box, Stack, SxProps, Theme } from "@mui/material";

import Chip from "components/Chip/Chip";
import { Text } from "components/Typography/Typography";

import { colors } from "src/themeConfig";

type DataGridHeaderTitleProps = {
  icon?: ElementType;
  title: string | ReactNode;
  desc?: string | ReactNode;
  count?: number | string;
  sx?: SxProps<Theme>;
  units?: {
    singular: string;
    plural: string;
  };
};

const getLabel = (
  count?: number | string,
  units?: {
    singular: string;
    plural: string;
  }
) => {
  if (typeof count === "number") {
    if (count > 0) {
      const unit = units ? (count > 1 ? units.plural : units.singular) : "";
      return `${count} ${unit}`;
    }
    return null;
  }
  return count;
};

const DataGridHeaderTitle: FC<DataGridHeaderTitleProps> = ({
  icon: Icon,
  title,
  desc,
  count,
  sx,
  units,
}) => {
  const label = getLabel(count, units);

  return (
    <Stack direction="row" gap="8px" alignItems="flex-start">
      {Icon && <Icon />}
      <Box sx={sx}>
        <Text
          size="large"
          weight="semibold"
          color={colors.blue900}
          sx={{ mb: "2px" }}
        >
          <span style={{ marginRight: "8px" }}>{title}</span>
          {label && (
            <Chip
              component="span"
              size="small"
              label={label}
              fontColor={colors.blue700}
              bgColor={colors.blue50}
              borderColor={colors.blue200}
            />
          )}
        </Text>
        {desc && (
          <Text size="small" weight="regular" color={colors.gray600}>
            {desc}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default DataGridHeaderTitle;
