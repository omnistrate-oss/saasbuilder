const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getPendingRestorePermissionsMailContentGCP(
  pendingRestorePermissionsEventObj,
  orgLogoURL,
  orgSupportEmail
) {
  const userName = pendingRestorePermissionsEventObj.eventPayload.user_name;
  const email = pendingRestorePermissionsEventObj.eventPayload.user_email;
  const accountId = pendingRestorePermissionsEventObj.eventPayload.account_id;
  const gcpDisconnectBashScript =
    pendingRestorePermissionsEventObj.eventPayload.gcp_disconnect_bash_script;
  const orgName = pendingRestorePermissionsEventObj.orgName;
  const subject = `Action Required: Connect GCP Account ${accountId} to ${orgName}`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "pendingRestorePermissionsGCP.ejs"
  );

  const baseURL = getSaaSDomainURL();

  const message = await ejs.renderFile(templatePath, {
    account_number: accountId,
    org_name: orgName,
    user_name: userName,
    logo_url: orgLogoURL,
    support_email: orgSupportEmail,
    gcp_disconnect_bash_script: gcpDisconnectBashScript,
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
  getPendingRestorePermissionsMailContentGCP,
};
