import Head from "next/head";
import { Box, Stack } from "@mui/material";
import Footer from "../Footer";
import Logo from "../Logo";
import BackgroundImg from "public/assets/images/non-dashboard/wave-background.svg";
import { useOrgDetails } from "src/context/OrgDetailsProvider";
// import NoLogoImage from "public/assets/images/logos/no-logo.png";
// import Image from "next/image";

const CenterContentLayout = ({ showLogo, children, pageTitle }) => {
  const { orgName, orgLogoURL } = useOrgDetails();

  return (
    <>
      {pageTitle && (
        <Head>
          <title>{pageTitle}</title>
        </Head>
      )}
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
              {orgLogoURL ? <Logo src={orgLogoURL} alt={orgName} /> : ""}
            </Box>
          )}
          {children}
        </Stack>
        <Footer />
      </Box>
    </>
  );
};

export default CenterContentLayout;
