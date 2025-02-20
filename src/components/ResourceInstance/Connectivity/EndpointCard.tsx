import { FC, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Text } from "src/components/Typography/Typography";
import CopyButton from "src/components/Button/CopyButton";
import Button from "src/components/Button/Button";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import StatusChip from "src/components/StatusChip/StatusChip";
import PublicResourceIcon from "src/components/Icons/PublicResource/PublicResource";
import PrivateResourceIcon from "src/components/Icons/PrivateResource/PrivateResource";
import { colors } from "src/themeConfig";

type EndpointCardProps = {
  isPrimary?: boolean;
  isPublic?: boolean;
  endpointName: string;
  endpointURL: string;
  openPorts?: number[];
};

const EndpointLine = ({ isPrimary, openPort, endpointURL, mt = "0px" }) => {
  return (
    <Stack direction="row" gap="6px" alignItems="center" mt={mt}>
      <Text
        size="small"
        weight="regular"
        color={isPrimary ? colors.utilBlue600 : "#475467"}
      >
        <span>{endpointURL}</span>
        {openPort && <span>:{openPort}</span>}
      </Text>

      <CopyButton
        text={openPort ? `${endpointURL}:${openPort}` : endpointURL}
        iconProps={{
          color: colors.blue600,
          width: 20,
          height: 20,
          marginTop: 0,
        }}
        iconButtonProps={{ padding: "0px" }}
      />
    </Stack>
  );
};

const EndpointCard: FC<EndpointCardProps> = ({
  isPrimary,
  isPublic,
  endpointName,
  endpointURL,
  openPorts,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowViewMoreButton = openPorts && openPorts.length > 1;

  return (
    <Box
      borderRadius="12px"
      p="12px 16px"
      display="flex"
      gap="16px"
      border={
        isPrimary ? `1px solid ${colors.utilBlue200}` : "1px solid #EAECF0"
      }
      bgcolor={isPrimary ? colors.utilBlue50 : "#FFFFFF"}
    >
      {isPublic ? <PublicResourceIcon /> : <PrivateResourceIcon />}

      <Box>
        <Stack direction="row" flexWrap="wrap" gap="8px" mb="6px">
          <Text size="small" weight="medium" color={colors.utilBlue700}>
            {endpointName}
          </Text>
          <StatusChip
            label={isPublic ? "Public" : "Private"}
            category={isPublic ? "success" : "unknown"}
          />
          {isPrimary && (
            <StatusChip
              label="Primary"
              color={colors.blue700}
              borderColor={colors.blue200}
              bgColor={colors.blue50}
            />
          )}
        </Stack>

        <EndpointLine
          endpointURL={endpointURL}
          isPrimary={isPrimary}
          openPort={openPorts?.[0]}
          mt="8px"
        />

        {isExpanded &&
          openPorts?.map((port, index) =>
            index >= 1 ? (
              <EndpointLine
                key={index}
                endpointURL={endpointURL}
                isPrimary={isPrimary}
                openPort={port}
                mt="18px"
              />
            ) : null
          )}

        {shouldShowViewMoreButton && (
          <Button
            sx={{ color: colors.blue600, marginTop: "8px" }}
            endIcon={
              isExpanded ? (
                <RemoveCircleOutlineIcon />
              ) : (
                <AddCircleOutlineIcon />
              )
            }
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "View Less" : "View More"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EndpointCard;
