import Image from "next/image";
import { styled } from "@mui/material";
import { styleConfig } from "src/providerConfig";

export const StyledImage = styled(Image)(({}) => ({
  width: "100%",
  maxWidth: 619,
  height: "auto",
  marginTop: 56,
  display: "block",
  marginInline: "auto",
}));

export const Title = styled("h1")(({ theme }) => ({
  fontWeight: 600,
  fontSize: "52px",
  lineHeight: "62px",
  position: "relative",
  // @ts-ignore
  [theme.breakpoints.down("desktop")]: {
    fontSize: 36,
    lineHeight: "44px",
  },
  // @ts-ignore
  [theme.breakpoints.down("tablet")]: {
    fontSize: 32,
    lineHeight: "40px",
    fontWeight: 800,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    borderLeft: `5px solid ${styleConfig.primaryColor}`,
    height: 64,
    left: -21,
    // @ts-ignore
    [theme.breakpoints.down("desktop")]: {
      height: "44px",
    },
    // @ts-ignore
    [theme.breakpoints.down("tablet")]: {
      height: "40px",
    },
  },
}));

export const SectionDescription = styled("p")(({ theme }) => ({
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px",
  color: "#221429",
  marginTop: 22,
  textAlign: "left",
  // @ts-ignore
  [theme.breakpoints.down("desktop")]: {
    fontSize: 14,
    lineHeight: "20px",
    marginTop: 16,
  },
}));

export const SectionHeading = styled("h1")(({ theme }) => ({
  marginTop: 58,
  textAlign: "left",
  fontWeight: 700,
  fontSize: 36,
  lineHeight: "44px",
  color: "#212121",
  // @ts-ignore
  [theme.breakpoints.down("desktop")]: {
    fontSize: 32,
    lineHeight: "40px",
    marginTop: 40,
  },
  // @ts-ignore
  [theme.breakpoints.down("tablet")]: {
    fontSize: 24,
    lineHeight: "32px",
    fontWeight: 800,
  },
}));
