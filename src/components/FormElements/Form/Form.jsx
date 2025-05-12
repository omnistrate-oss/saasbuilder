import { Box } from "@mui/material";
import React from "react";

const Form = React.forwardRef(function FormWithRef(props, ref) {
  return <Box component={"form"} ref={ref} {...props} />;
});
export default Form;
