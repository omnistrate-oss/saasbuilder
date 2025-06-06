import { Metadata } from "next";

import { getRenderIdentityProvidersList } from "src/server/api/identity-provider";
import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";
import { getEnvironmentType } from "src/server/utils/getEnvironmentType";
import { getSaaSDomainURL } from "src/server/utils/getSaaSDomainURL";
import { IdentityProvider } from "src/types/identityProvider";

import SigninPage from "./components/SigninPage";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

const Page = async () => {
  const idpRedirectUri = `${getSaaSDomainURL()}/idp-auth`;
  const identityProvidersResponse = await getRenderIdentityProvidersList({
    environmentType: getEnvironmentType(),
    redirectUrl: idpRedirectUri,
  });

  const identityProviders: IdentityProvider[] = identityProvidersResponse.data.identityProviders || [];

  //sort identity providers by login button text
  //if loginButtonText is not available, use a default text based on the provider name
  identityProviders.sort((a, b) => {
    const loginButtonTextA = (a.loginButtonText || `Continue with ${a.name || a.identityProviderName}`).toLowerCase();
    const loginButtonTextB = (b.loginButtonText || `Continue with ${b.name || b.identityProviderName}`).toLowerCase();

    return loginButtonTextA.localeCompare(loginButtonTextB);
  });

  const isPasswordLoginEnabled = process.env.DISABLE_PASSWORD_LOGIN?.toLowerCase() !== "true";

  return (
    <SigninPage
      isReCaptchaSetup={checkReCaptchaSetup()}
      saasBuilderBaseURL={getSaaSDomainURL()}
      googleReCaptchaSiteKey={process.env.GOOGLE_RECAPTCHA_SITE_KEY || ""}
      isPasswordLoginEnabled={isPasswordLoginEnabled}
      identityProviders={identityProviders}
    />
  );
};

export default Page;
