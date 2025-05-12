import React from "react";
import { Box } from "@mui/material";

const Form = React.forwardRef(function FormWithRef(props, ref) {
  return <Box component={"form"} ref={ref} {...props} />;
});
export default Form;
