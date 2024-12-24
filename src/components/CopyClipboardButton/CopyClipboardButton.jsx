import { useState } from "react";
import clipboard from "clipboardy";
import Tooltip from "../Tooltip/Tooltip";
import { IconButton } from "@mui/material";
import DataGridCopyIcon from "../Icons/CopyIcon/DataGridCopyIcon";

const CopyToClipboardButton = (props) => {
  const { text = "", iconProps, buttonStyles = {} } = props;
  const [tooltipText, setTooltipText] = useState("Click to copy");

  function handleClick() {
    if (text) {
      clipboard
        .write(text)
        .then(() => {
          setTooltipText("Copied");
        })
        .catch(() => {
          setTooltipText("Unable to copy to clipboard");
        });
    } else {
      setTooltipText("Nothing to be copied!");
    }
  }

  return (
    <Tooltip
      title={tooltipText}
      onOpen={() => {
        setTooltipText("Click to copy");
      }}
      placement="top"
    >
      <IconButton onClick={handleClick} sx={buttonStyles}>
        <DataGridCopyIcon color="#7F56D9" {...iconProps} />
      </IconButton>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
