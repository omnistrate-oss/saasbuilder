const axios = require("axios");

//This function takes the token provided by the google recaptcha client widget as input and verifies it using the google captcha verification API
//Returns true if the verification is successful or if the quota limit has been exceeded, else returns false
async function verifyRecaptchaToken(token: string) {
  const googleReCaptchaSecretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  const formData = `secret=${googleReCaptchaSecretKey}&response=${token}`;
  //   console.log("Token", token);

  let isVerified = false;

  try {
    const googleAPIResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log("Google Response", googleAPIResponse.data);
    if (googleAPIResponse?.data?.success === true) isVerified = true;
    else isVerified = false;
  } catch {
    isVerified = false;
  }

  if (isVerified) return true;
  else return false;
}

module.exports = {
  verifyRecaptchaToken: verifyRecaptchaToken,
};
