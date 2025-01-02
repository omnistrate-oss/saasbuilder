import { ElementType, FC, ReactNode } from "react";
import { Box, Stack, SxProps, Theme } from "@mui/material";

import Chip from "components/Chip/Chip";
import { Text } from "components/Typography/Typography";

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
        <Stack direction="row" gap="8px" mb="2px">
          <Text size="large" weight="semibold" color="#08386B">
            {title}
          </Text>
          {label && (
            <Chip
              size="small"
              label={label}
              fontColor="#0E5FB5"
              bgColor="#E8F3FF"
              borderColor="#93C7FF"
            />
          )}
        </Stack>
        {desc && (
          <Text size="small" weight="regular" color="#535862">
            {desc}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default DataGridHeaderTitle;
