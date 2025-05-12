const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getPendingRevokePermissionsMailContentGCP(
  pendingRevokePermissionsEventObj,
  orgLogoURL,
  orgSupportEmail
) {
  const userName = pendingRevokePermissionsEventObj.eventPayload.user_name;
  const email = pendingRevokePermissionsEventObj.eventPayload.user_email;
  const accountId = pendingRevokePermissionsEventObj.eventPayload.account_id;
  const disconnectCloudFormationURL = pendingRevokePermissionsEventObj.eventPayload.gcp_disconnect_bash_script;
  const orgName = pendingRevokePermissionsEventObj.orgName;
  const subject = `Action Required: Disconnect GCP Account ${accountId} from ${orgName}`;

  const templatePath = path.resolve(__dirname, "..", "ejsTemplates", "pendingRevokePermissionsGCP.ejs");

  const baseURL = getSaaSDomainURL();

  const message = await ejs.renderFile(templatePath, {
    account_number: accountId,
    org_name: orgName,
    user_name: userName,
    logo_url: orgLogoURL,
    support_email: orgSupportEmail,
    gcp_disconnect_bash_script: disconnectCloudFormationURL,
    bottom_bg_image_url: `${baseURL}/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/mail/cloud-hero-section.png`,
    disconnected_confirmation: `${baseURL}/mail/disconnected_confirmation.png`,
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
  getPendingRevokePermissionsMailContentGCP,
};
