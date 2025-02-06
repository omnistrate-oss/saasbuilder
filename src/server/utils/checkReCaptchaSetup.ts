export function checkReCaptchaSetup(): boolean {
  const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  const siteKey = process.env.GOOGLE_RECAPTCHA_SITE_KEY;

  const isSetup = Boolean(
    secretKey &&
      siteKey &&
      secretKey.toUpperCase() !== "DISABLED" &&
      siteKey.toUpperCase() !== "DISABLED"
  );

  return isSetup;
}
