"use client";

import { Box, Stack } from "@mui/material";

import Footer from "components/NonDashboardComponents/Footer";

import BackgroundImg from "public/assets/images/non-dashboard/wave-background.svg";

const CenterContentLayout = ({ children }) => {
  return (
    <Box
      height="100%"
      sx={{
        position: "relative", // For the Footer
        display: "grid",
        placeItems: "center",
        backgroundImage: `url(${BackgroundImg.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        paddingBottom: "60px",
      }}
    >
      <Stack gap="32px" maxWidth="480px">
        {children}
      </Stack>
      <Footer />
    </Box>
  );
};

export default CenterContentLayout;
