import { Metadata } from "next";
import { IDENTITY_PROVIDER_TYPES } from "app/(public)/(main-image)/signin/constants";

import { getIdentityProvidersList, getRenderIdentityProvidersList } from "src/server/api/identity-provider";
import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";
import { getEnvironmentType } from "src/server/utils/getEnvironmentType";
import { getSaaSDomainURL } from "src/server/utils/getSaaSDomainURL";

import SigninPage from "./components/SigninPage";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

const Page = async () => {
  const identityProvidersResponse = await getRenderIdentityProvidersList({
    environmentType: getEnvironmentType(),
    redirectUrl: "https://omnistrate-dev-access-ui.fly.dev",
  });
  const identityProviders = identityProvidersResponse.data.identityProviders || [];

  const isPasswordLoginEnabled = !Boolean(process.env.DISABLE_PASSWORD_LOGIN);

  return (
    <SigninPage
      isReCaptchaSetup={checkReCaptchaSetup()}
      saasBuilderBaseURL={getSaaSDomainURL()}
      googleReCaptchaSiteKey={process.env.GOOGLE_RECAPTCHA_SITE_KEY || null}
      isPasswordLoginEnabled={isPasswordLoginEnabled}
      identityProviders={identityProviders}
    />
  );
};

export default Page;
