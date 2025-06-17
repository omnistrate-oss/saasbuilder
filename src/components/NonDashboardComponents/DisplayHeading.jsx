import styled from "@emotion/styled";
import { Typography } from "@mui/material";

const DisplayHeading = styled((props) => <Typography component="h1" {...props} />)(() => ({
  fontWeight: "600",
  fontSize: "30px",
  lineHeight: "38px",
  textAlign: "center",
  color: "#111827",
}));

export default DisplayHeading;
