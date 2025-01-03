import Head from "next/head";
import React from "react";
import { Title, SectionHeading, SectionDescription } from "./terms-of-use";
import { Box, styled } from "@mui/material";
import Link from "next/link";
import Container from "src/components/NonDashboardComponents/Container/Container";
import { useOrgDetails } from "src/context/OrgDetailsProvider";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

const List = styled("ul")(() => ({
  marginTop: "16px",
  padding: "0px",
  listStyleType: "disc",
  marginLeft: "20px",
}));

const ListItem = styled("li")({
  "& + &": {
    marginTop: "16px",
  },
});

function CookiePolicy() {
  const { orgName, orgSupportEmail } = useOrgDetails();

  const pageTitle = orgName ? `Cookie Policy - ${orgName}` : "Cookie Policy";
  const metaDescription = orgName
    ? `Cookie Policy - ${orgName}`
    : "Cookie Policy";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <Container
        maxWidth="858px"
        sx={{
          paddingTop: {
            mobile: "40px",
            desktop: "100px",
          },
          paddingBottom: {
            mobile: "40px",
            desktop: "100px",
          },
        }}
      >
        <Title>Cookie Policy</Title>
        <>
          <SectionDescription>
            Last Updated: Jan 03, 2025
            <br />
            <br />
            This Cookie Policy explains how {orgName} (referred to as
            &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and
            similar technologies to recognize you when you visit our websites.
            This document outlines what cookies are, how we use them, and your
            rights to control them.
          </SectionDescription>
          <SectionHeading>What Are Cookies?</SectionHeading>
          <SectionDescription>
            Cookies are small text files that websites store on your device to
            uniquely identify your browser or store information or settings.
            They help improve navigation, remember preferences, enable
            functionality, and analyze website performance.
            <br />
            <br />
            Cookies set by the website owner (in this case, {orgName}) are
            called &quot;first-party cookies&quot;. Cookies set by third parties
            are called &quot;third-party cookies&quot;. These enable third-party
            features or functionalities, such as advertising, analytics, or
            embedded content, on the website.
          </SectionDescription>
          <SectionHeading>
            Categories of Cookies and Their Providers
          </SectionHeading>
          <SectionDescription>test</SectionDescription>

          <SectionHeading>How Can You Manage Cookies?</SectionHeading>
          <SectionDescription>
            You have the right to decide whether to accept or reject cookies.
            When you visit our websites, you may see a cookie notice that
            explains how we use cookies and provides an option to manage your
            preferences. You can:
            <List>
              <ListItem>
                <Box fontWeight={700}>Cookie Settings</Box>
                Access and update your cookie preferences at any time by
                clicking on the &quot;Cookie Settings&quot; link in the footer
                of our website.
              </ListItem>
              <ListItem>
                <Box fontWeight={700}>Adjust Browser Settings</Box>
                Most web browsers allow you to control cookies through their
                settings. You can configure your browser to block cookies or
                alert you when cookies are being set. Note that blocking some
                cookies may impact website functionality.
              </ListItem>
              <ListItem>
                <Box fontWeight={700}>Google Analytics Opt-Out</Box>
                To opt out of Google Analytics, you can install the Google
                Analytics Opt-Out Browser Add-on: Google Opt-Out.
              </ListItem>
            </List>
          </SectionDescription>
          <SectionHeading>Updates to This Policy</SectionHeading>
          <SectionDescription>
            We may update this Cookie Policy from time to time to reflect
            changes in technology or applicable laws. Please review this page
            periodically for the latest information.
          </SectionDescription>

          <SectionHeading>Contact Us</SectionHeading>
          <SectionDescription>
            If you have any questions about our use of cookies, please contact
            us at{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, textDecoration: "underline" }}
            >
              <Link
                href={`mailto:${orgSupportEmail}`}
                style={{ color: "#2970FF" }}
              >
                &nbsp;{orgSupportEmail}
              </Link>
            </Box>. 
            Thank you for choosing {orgName}! 
          </SectionDescription>
        </>
      </Container>
    </>
  );
}

export default CookiePolicy;
