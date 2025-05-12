import { Box, styled } from "@mui/material";
import { Text } from "../Typography/Typography";

const Card = styled(Box)(() => ({
  background: "#FFFFFF",
  border: " 1px solid #EAECF0",
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
  borderRadius: "12px",
  padding: 24,
}));

export const CardTitle = (props) => {
  const { children, ...restProps } = props;
  return (
    <Box padding="20px 24px" borderBottom="1px solid #EAECF0" {...restProps}>
      <Text size="large">{children}</Text>
    </Box>
  );
};
export default Card;
