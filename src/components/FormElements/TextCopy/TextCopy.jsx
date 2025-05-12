import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, ButtonBase, styled } from "@mui/material";
import MuiInputAdornment from "@mui/material/InputAdornment";
import clipboard from "clipboardy";
import { useState } from "react";
import Tooltip from "src/components/Tooltip/Tooltip";

import { Text } from "../../Typography/Typography";

const TextCopy = (props) => {
  const { copyButton, ...restProps } = props;
  const textToCopy = props.value;

  let endAdornment = "";
  if (copyButton) {
    endAdornment = (
      <InputAdornment position="end">
        <CopyButton sx={{ width: "24px", height: "24px" }} textToCopy={textToCopy} />
      </InputAdornment>
    );
  }
  return (
    <Box display="flex">
      <Text {...restProps}>{textToCopy}</Text>
      {endAdornment}
    </Box>
  );
};

export default TextCopy;

const CopyButton = (props) => {
  const { textToCopy = "" } = props;
  const [text, setText] = useState("Click to copy");

  function handleClick() {
    if (textToCopy) {
      clipboard
        .write(textToCopy)
        .then(() => {
          setText("Copied");
        })
        .catch(() => {
          setText("Unable to copy to clipboard");
        });
    } else {
      setText("Nothing to be copied!");
    }
  }

  return (
    <Tooltip
      title={text}
      onOpen={() => {
        setText("Click to copy");
      }}
      placement="top"
    >
      <ButtonBase
        sx={{
          height: "24px",
          width: "24px",
          paddingLeft: "18px",
          paddingRight: "10px",
          paddingTop: "15px",
          padding: "15px",
          color: "#344054",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 600,
        }}
        onClick={handleClick}
      >
        <ContentCopyIcon sx={{ fontSize: "24px", color: "#7F56D9" }} />
      </ButtonBase>
    </Tooltip>
  );
};

const InputAdornment = styled(MuiInputAdornment)({
  height: "100%",
  maxHeight: "none",
});
