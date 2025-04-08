const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getPendingRestorePermissionsMailContentAWS(
  pendingRestorePermissionsEventObj,
  orgLogoURL,
  orgSupportEmail
) {
  const userName = pendingRestorePermissionsEventObj.eventPayload.user_name;
  const email = pendingRestorePermissionsEventObj.eventPayload.user_email;
  const accountId = pendingRestorePermissionsEventObj.eventPayload.account_id;
  const connectCloudFormationURL =
    pendingRestorePermissionsEventObj.eventPayload.connect_cfn_url;
  const orgName = pendingRestorePermissionsEventObj.orgName;
  const subject = `Action Required: Connect AWS Account ${accountId} to ${orgName}`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "pendingRestorePermissionsAWS.ejs"
  );

  const baseURL = getSaaSDomainURL();

  const message = await ejs.renderFile(templatePath, {
    account_number: accountId,
    org_name: orgName,
    user_name: userName,
    logo_url: orgLogoURL,
    support_email: orgSupportEmail,
    connect_cloud_formation_url: connectCloudFormationURL,
    bottom_bg_image_url: `${baseURL}/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/mail/cloud-hero-section.png`,
    connected_confirmation: `${baseURL}/mail/connected_confirmation.png`,
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
  getPendingRestorePermissionsMailContentAWS,
};
