import ResetPasswordPage from "src/features/ResetPassword/ResetPasswordPage";
import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";

export const getServerSideProps = async () => {

  return {
    props: {
      googleReCaptchaSiteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY || null,
      isReCaptchaSetup: checkReCaptchaSetup(),
    },
  };
};

export default ResetPasswordPage;
