import { Metadata } from "next";

import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";
import { getSaaSDomainURL } from "src/server/utils/getSaaSDomainURL";

import SignupPage from "./components/SignupPage";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up for an account",
};

const Page = async () => {
  return (
    <SignupPage
      isReCaptchaSetup={checkReCaptchaSetup()}
      saasBuilderBaseURL={getSaaSDomainURL()}
      googleReCaptchaSiteKey={process.env.GOOGLE_RECAPTCHA_SITE_KEY || null}
    />
  );
};

export default Page;
