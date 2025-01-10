import Head from "next/head";
import Image from "next/image";
import { Box } from "@mui/material";
import MainImg from "public/assets/images/non-dashboard/signin-main.svg";
import Footer from "../Footer";
import Logo from "../Logo";
import CurvedArrow from "../Icons/CurvedArrow";
import { useOrgDetails } from "src/context/OrgDetailsProvider";

const MainImageLayout = ({
  pageTitle,
  showArrow,
  children,
  contentMaxWidth = 480,
}) => {
  const { orgName, orgLogoURL } = useOrgDetails();
  return (
    <>
      {pageTitle && (
        <Head>
          <title>{pageTitle}</title>
        </Head>
      )}
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
              {showArrow && (
                <CurvedArrow
                  style={{ position: "absolute", top: "-80px", left: "0px" }}
                />
              )}
              {orgLogoURL ? <Logo src={orgLogoURL} alt={orgName} /> : ""}
            </Box>
            {children}
          </Box>
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default MainImageLayout;
