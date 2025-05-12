import { Box,InputBase, inputBaseClasses, styled } from "@mui/material";
import NextLink from "next/link";

export const Heading = styled("h1")(({ theme }) => ({
  fontSize: 36,
  lineHeight: "44px",
  fontWeight: 800,
  [theme.breakpoints.down("desktop")]: {
    textAlign: "center",
    fontSize: 32,
    lineHeight: "40px",
  },
  [theme.breakpoints.down("tablet")]: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: "32px",
  },
}));

export const Card = styled(Box)(() => ({
  padding: 32,
  background: "white",
  border: "1px solid #D9E0E8",
  boxShadow: " 0px 1px 8px rgba(77, 94, 104, 0.12)",
  borderRadius: 12,
  minHeight: 430,
}));

export const CardTitle = styled("h2")(() => ({
  fontSize: 20,
  lineHeight: "28px",
  lineHeightStep: 700,
  color: "#111827",
}));

export const Link = styled(NextLink, {
  shouldForwardProp: (prop) => prop !== "underlined",
})(({ underlined }) => ({
  color: "#257304",
  fontSize: 14,
  lineHeight: "20px",
  fontWeight: 400,
  textDecoration: underlined ? "underline" : "none",
}));

const ErrorMessage = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: 8,
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  // marginTop: 12,
  boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
  fontSize: 14,
  lineHeight: "20px",
  border: " 1px solid #D1D5DB",
  borderRadius: "6px",
  [`& .${inputBaseClasses.input}`]: {
    padding: "10px 12px",
    color: "#111827",
    borderRadius: "6px",
  },
  [`&.${inputBaseClasses.error}`]: {
    border: `1px solid ${theme.palette.error[300]}`,
  },
  [`& .${inputBaseClasses.input}::placeholder`]: {
    opacity: 1,
    color: "#9CA3AF",
  },
}));

const WrapperRoot = styled(Box)(() => ({}));

export const Input = (props) => {
  const { errorMsg, label, sx, mt, mb, pt, pb, className, ...restProps } = props;
  const { error } = props;

  return (
    <WrapperRoot sx={sx} mt={mt} mb={mb} pt={pt} pb={pb} className={className}>
      {label && (
        <label
          style={{
            fontWeight: 500,
            fontSize: 14,
            lineHeight: "20px",
            marginBottom: 4,
          }}
        >
          {label}
        </label>
      )}
      <StyledInput {...restProps} />
      {error ? <ErrorMessage>{errorMsg ? errorMsg : "Required"}</ErrorMessage> : ""}
    </WrapperRoot>
  );
};
