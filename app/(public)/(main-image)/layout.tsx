"use client";

import Image from "next/image";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";

import Logo from "src/components/NonDashboardComponents/Logo";
import Footer from "src/components/NonDashboardComponents/Footer";
import { useProviderOrgDetails } from "src/providers/ProviderOrgDetailsProvider";

import MainImg from "public/assets/images/non-dashboard/signin-main.svg";
// import CurvedArrow from "src/components/NonDashboardComponents/Icons/CurvedArrow";

const MainImageLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { orgName, orgLogoURL } = useProviderOrgDetails();
  const contentMaxWidth = pathname === "/signin" ? 480 : 650;

  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr" height="100%">
      {/* Image Box */}
      <Box
        p="50px 36px"
        sx={{
          display: "grid",
          placeItems: "center",
          boxShadow: "0px 12px 16px -4px #10182814",
        }}
      >
        <Image
          src={MainImg}
          alt="Hero Image"
          width={646}
          height={484}
          style={{ maxWidth: "800px", height: "auto" }}
          priority
        />
      </Box>
      <Box
        sx={{
          position: "relative", // For the Footer
          display: "grid",
          placeItems: "center",
          padding: "24px 55px 60px",
        }}
      >
        <Box maxWidth={contentMaxWidth} width="100%" mx="auto">
          {/* Logo */}
          <Box
            position="relative" // For the Curved Arrow
            textAlign="center"
          >
            {/* TODO: Check and Make this Work */}
            {/* {showArrow && (
              <CurvedArrow
                style={{ position: "absolute", top: "-80px", left: "0px" }}
              />
            )} */}
            {orgLogoURL ? <Logo src={orgLogoURL} alt={orgName} /> : ""}
          </Box>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainImageLayout;