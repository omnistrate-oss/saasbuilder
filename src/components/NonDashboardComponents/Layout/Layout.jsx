import { Box, styled } from "@mui/material";
import React from "react";

const ContentWrapper = styled(Box)(({ theme }) => ({
  minHeight: "calc(100% - 88px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "white",
  [theme.breakpoints.down("desktop")]: {
    minHeight: "calc(100% - 60px)",
  },
}));

function Layout(props) {
  const { children } = props;
  return (
    <>
      <ContentWrapper>
        <main>{children}</main>
      </ContentWrapper>
    </>
  );
}

export default Layout;
