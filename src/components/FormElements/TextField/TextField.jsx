import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { Box, ButtonBase, styled } from "@mui/material";
import MuiInputAdornment from "@mui/material/InputAdornment";
import MuiTextField from "@mui/material/TextField";
import clipboard from "clipboardy";
import { forwardRef, useState } from "react";
import Tooltip from "src/components/Tooltip/Tooltip";

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
          borderLeft: "1px solid #D0D5DD",
          height: "100%",
          paddingLeft: "18px",
          paddingRight: "10px",
          color: "#344054",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 600,
        }}
        onClick={handleClick}
      >
        <ContentCopyIcon sx={{ fontSize: "16px", color: "#344054" }} />
      </ButtonBase>
    </Tooltip>
  );
};

const InputAdornment = styled(MuiInputAdornment)({
  height: "100%",
  maxHeight: "none",
  marginLeft: "0px",
});

const StyledTextField = styled(MuiTextField, {
  shouldForwardProp: (prop) => {
    return prop !== "readonly";
  },
})(({ readonly }) => ({
  boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
  borderRadius: 8,
  flexGrow: 1,
  [`& .MuiOutlinedInput-input`]: {
    padding: "10px 12px",
    //border: "1px solid #D1D5DB",
    borderRadius: 8,
    caretColor: readonly ? "transparent" : "auto",
  },
  [`& .MuiOutlinedInput-input:disabled`]: {
    background: "#F9FAFB",
    color: "#667085",
    // color: "#4a505d",
    WebkitTextFillColor: "#667085",
  },
  [`& .MuiOutlinedInput-root`]: {
    borderRadius: 8,
  },
  [`& .MuiOutlinedInput-notchedOutline`]: {
    borderColor: "#D0D5DD",
  },
  // [`& .Mui-focused .MuiOutlinedInput-notchedOutline`]: {
  //   borderColor: "rgba(254, 228, 226, 1)",
  // },
  [`& .MuiSelect-icon`]: {
    color: "black",
  },
}));

const TextField = forwardRef(function StyledTextFieldRef(props, ref) {
  const { copyButton, search, SelectProps, ...restProps } = props;
  const textToCopy = props.value;

  let endAdornment = "";
  let startAdornment = "";

  if (copyButton) {
    endAdornment = (
      <InputAdornment position="end">
        <CopyButton textToCopy={textToCopy} />
      </InputAdornment>
    );
  }

  if (search) {
    startAdornment = (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    );
  }

  return (
    <Box display="flex">
      <StyledTextField
        fullWidth
        InputProps={{
          endAdornment,
          startAdornment,
          inputRef: ref,
        }}
        SelectProps={{
          IconComponent: KeyboardArrowDownIcon,
          ...SelectProps,
        }}
        {...restProps}
      />
    </Box>
  );
});

export default TextField;
