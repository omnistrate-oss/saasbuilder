"use client";

import { Box, Stack } from "@mui/material";
import { usePathname } from "next/navigation";

import Logo from "src/components/NonDashboardComponents/Logo";
import Footer from "src/components/NonDashboardComponents/Footer";

import { useProviderOrgDetails } from "src/providers/ProviderOrgDetailsProvider";
import BackgroundImg from "public/assets/images/non-dashboard/wave-background.svg";

const CenterContentLayout = ({ children }) => {
  const pathname = usePathname();
  const { orgName, orgLogoURL } = useProviderOrgDetails();
  const showLogo = pathname !== "/validate-token";

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
        {showLogo && (
          <Box textAlign="center">
            {orgLogoURL ? (
              <Logo
                src={orgLogoURL}
                alt={orgName}
                style={{ width: "120px", height: "auto", maxHeight: "unset" }}
              />
            ) : (
              ""
            )}
          </Box>
        )}
        {children}
      </Stack>
      <Footer />
    </Box>
  );
};

export default CenterContentLayout;
