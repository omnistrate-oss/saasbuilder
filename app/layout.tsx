import { Metadata } from "next";
// import Script from "next/script";
import RootProviders from "./RootProviders";

import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import { getProviderOrgDetails } from "src/server/api/customer-user";

import { ProviderUser } from "src/types/users";
import { EnvironmentType } from "src/types/common/enums";

import "./globals.css";

export const metadata: Metadata = {
  title: "Omnistrate",
  description:
    "Working template for a SaaS service Front-end for Services created using Omnistrate",
};

export const dynamic = "force-dynamic";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const providerOrgDetails: { data: ProviderUser } =
    await getProviderOrgDetails();

  return (
    <html lang="en">
      <head>
        {/* {process.env.GOOGLE_ANALYTICS_TAG_ID && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TAG_ID}`}
            strategy="afterInteractive"
          />
        )}
        {process.env.GOOGLE_ANALYTICS_TAG_ID && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
	              window.dataLayer = window.dataLayer || [];
	              function gtag(){window.dataLayer.push(arguments);}
	              gtag('js', new Date());

	              gtag('config', '${process.env.GOOGLE_ANALYTICS_TAG_ID}');
	            `}
          </Script>
        )} */}
        <link rel="icon" href="" id="provider-favicon" />
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta httpEquiv="pragma" content="no-cache" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          // @ts-ignore
          crossOrigin="true"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {process.env.GOOGLE_ANALYTICS_TAG_ID && (
          <noscript>
            {/* eslint-disable-next-line react/self-closing-comp */}
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.GOOGLE_ANALYTICS_TAG_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        <RootProviders
          envType={
            (process.env.ENVIRONMENT_TYPE ||
              ENVIRONMENT_TYPES.PROD) as EnvironmentType
          }
          providerOrgDetails={providerOrgDetails.data}
        >
          {children}
        </RootProviders>
      </body>
    </html>
  );
};

export default RootLayout;
