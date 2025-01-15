import { FC, useState } from "react";
import { Box, Stack } from "@mui/material";
import EndpointIcon from "./EndpointIcon";
import { Text } from "src/components/Typography/Typography";
import CopyButton from "src/components/Button/CopyButton";
import Chip from "components/Chip/Chip";
import Button from "src/components/Button/Button";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

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
        color={isPrimary ? "#6941C6" : "#475467"}
      >
        <span>{endpointURL}</span>
        {openPort && <span>:{openPort}</span>}
      </Text>

      <CopyButton
        text={openPort ? `${endpointURL}:${openPort}` : endpointURL}
        iconProps={{
          color: "#6941C6",
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
      p="16px"
      display="flex"
      gap="16px"
      border={isPrimary ? "2px solid #7F56D9" : "1px solid #D0D5DD"}
      bgcolor={isPrimary ? "#F9F5FF" : "#FFFFFF"}
    >
      <EndpointIcon />

      <Box>
        <Stack direction="row" flexWrap="wrap" gap="8px" mb="6px">
          <Text size="small" weight="medium" color="#53389E">
            {endpointName}
          </Text>
          {isPublic ? (
            <Chip
              size="small"
              label="Public"
              fontColor="#067647"
              bgColor="#ECFDF3"
              borderColor="#ABEFC6"
            />
          ) : (
            <Chip
              size="small"
              label="Private"
              fontColor="#363F72"
              bgColor="transparent"
              borderColor="#3E4784"
            />
          )}
          {isPrimary && (
            <Chip
              size="small"
              label="Primary"
              fontColor="#175CD3"
              bgColor="#EFF8FF"
              borderColor="#B2DDFF"
            />
          )}
        </Stack>

        <EndpointLine
          endpointURL={endpointURL}
          isPrimary={isPrimary}
          openPort={openPorts?.[0]}
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
            sx={{ color: "#6941C6", marginTop: "8px" }}
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
