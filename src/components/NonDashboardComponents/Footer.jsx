import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useOrgDetails } from "src/context/OrgDetailsProvider";
import { useCookieConsentContext } from "src/context/cookieConsentContext";

const Footer = () => {
  const { setIsConsentModalOpen } = useCookieConsentContext();
  const { orgName } = useOrgDetails();
  return (
    <Box
      position="absolute"
      bottom="14px"
      left="0"
      right="0"
      display="flex"
      justifyContent="center"
      gap="10px"
    >
      <Typography
        fontWeight="500"
        fontSize="14px"
        lineHeight="22px"
        color="#A0AEC0"
      >
        © {new Date().getFullYear()} {orgName}{" "}
        <Box component="span" sx={{ marginLeft: "12px" }}>
          All rights reserved.
        </Box>
      </Typography>

      <Link
        href="/terms-of-use"
        style={{
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "22px",
          color: "#111827",
        }}
      >
        Terms & Conditions
      </Link>
      <Link
        href="/privacy-policy"
        style={{
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "22px",
          color: "#111827",
        }}
      >
        Privacy Policy
      </Link>
      <Typography
        component="p"
        sx={{
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "22px",
          color: "#111827",
          cursor: "pointer",
        }}
        onClick={() => {
          setIsConsentModalOpen(true);
        }}
      >
        Cookie Settings
      </Typography>
    </Box>
  );
};
export default Footer;
