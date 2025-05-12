import { Box, styled } from "@mui/material";

const FieldContainer = styled(Box, {
  shouldForwardProp: (prop) => {
    return prop !== "row";
  },
})(({ row }) => ({
  marginTop: 18,
  display: row && "flex",
  justifyContent: row && "space-between",
  gap: row && "32px",
}));

export default FieldContainer;
