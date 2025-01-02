import { FC } from "react";
import { Metadata } from "next";
import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";
import ResetPasswordPage from "src/features/ResetPassword/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

const Page: FC = () => {
  return (
    <ResetPasswordPage
      googleReCaptchaSiteKey={process.env.GOOGLE_RECAPTCHA_SITE_KEY || null}
      isReCaptchaSetup={checkReCaptchaSetup()}
    />
  );
};

export default Page;
