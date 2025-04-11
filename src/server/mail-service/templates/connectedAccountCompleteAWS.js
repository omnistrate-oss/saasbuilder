const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getConnectedAccountCompleteMailContentAWS(
  connectedAccountCompleteEventObj,
  orgLogoURL,
  orgSupportEmail
) {
  const userName = connectedAccountCompleteEventObj.eventPayload.user_name;
  const email = connectedAccountCompleteEventObj.eventPayload.user_email;
  const accountId = connectedAccountCompleteEventObj.eventPayload.account_id;
  const orgName = connectedAccountCompleteEventObj.orgName;

  const subject = `Success: AWS Account ${accountId} Connected to ${orgName}`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "connectedAccountCompleteAWS.ejs"
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
    connected_success: `${baseURL}/mail/connected_success.png`,
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
  getConnectedAccountCompleteMailContentAWS,
};
