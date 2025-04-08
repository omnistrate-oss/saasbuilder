const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getDisconnectedAccountCompleteMailContentAWS(
  disconnectedAccountCompleteEventObj,
  orgLogoURL,
  orgSupportEmail
) {
  const userName = disconnectedAccountCompleteEventObj.eventPayload.user_name;
  const email = disconnectedAccountCompleteEventObj.eventPayload.user_email;
  const accountId = disconnectedAccountCompleteEventObj.eventPayload.account_id;
  const orgName = disconnectedAccountCompleteEventObj.orgName;

  const subject = `Success: AWS Account ${accountId} Disconnected from ${orgName}`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "disconnectedAccountcompleteAWS.ejs"
  );

  const baseURL = getSaaSDomainURL();

  const message = await ejs.renderFile(templatePath, {
    account_number: accountId,
    org_name: orgName,
    user_name: userName,
    logo_url: orgLogoURL,
    support_email: orgSupportEmail,
    bottom_bg_image_url: `${baseURL}/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/mail/cloud-hero-section.png`,
    disconnected_success: `${baseURL}/mail/disconnected_success.png`,
  });

  const recepientEmail = email;

  let mailContent = null;
  if (orgName && accountId && orgSupportEmail && recepientEmail) {
    mailContent = {
      recepientEmail: recepientEmail,
      subject: subject,
      message: message,
      senderName: orgName,
    };
  }

  return mailContent;
}

module.exports = {
  getDisconnectedAccountCompleteMailContentAWS,
};
