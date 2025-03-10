const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getSignUpMailContent(signUpEventObj, orgLogoURL) {
  // orgID = signUpEventObj.orgID;
  const email = signUpEventObj.userEmail;
  const saasDomainURL = getSaaSDomainURL();
  // [username, provider] = email.split("@");
  //const encodedEmail = encodeURIComponent(username + `+${orgID}@` + provider);
  const activationURL = encodeURI(
    `${saasDomainURL}/validate-token?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(signUpEventObj.eventPayload.token)}`
  );

  const subject = `Action Required: Please activate your ${signUpEventObj.orgName} account now`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "userSignUp.ejs"
  );

  const baseURL = saasDomainURL;

  const message = await ejs.renderFile(templatePath, {
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/mail/cloud-hero-section.png`,
    user_signup: `${baseURL}/mail/user-signup.png`,
    get_started: activationURL,
    username: signUpEventObj.userName || signUpEventObj.eventPayload.user_name,
  });

  return {
    recepientEmail: signUpEventObj.userEmail,
    subject: subject,
    message: message,
    senderName: signUpEventObj.orgName,
  };
}

module.exports = {
  getSignUpMailContent,
};
