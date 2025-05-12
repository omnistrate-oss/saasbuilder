import { styled } from "@mui/material";
import { weights } from "../../Typography/Typography";
import Box from "@mui/material/Box";

const StyledFieldLabel = styled((props) => <Box component="label" {...props} />)(() => ({
  color: "#344054",
  fontSize: 14,
  lineHeight: "20px",
  fontWeight: weights.medium,
  cursor: "text",
}));

const RequiredAsterisk = (props) => (
  <Box component="span" sx={{ color: "red" }} {...props}>
    *
  </Box>
);

const FieldLabel = (props) => {
  const { required, children, ...restProps } = props;
  return (
    <StyledFieldLabel {...restProps}>
      {children} {required && <RequiredAsterisk />}
    </StyledFieldLabel>
  );
};

export default FieldLabel;
