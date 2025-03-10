const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getUpgradeScheduledMailContent(
  upgradeEventObj,
  orgLogoURL,
  supportEmail
) {
  const email = upgradeEventObj.userEmail;
  const saasDomainURL = getSaaSDomainURL();
  const subject = "Your instance is scheduled for a version upgrade";
  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "upgradeScheduled.ejs"
  );

  const event = upgradeEventObj.eventPayload;

  const message = await ejs.renderFile(templatePath, {
    logo_url: orgLogoURL,
    org_name: upgradeEventObj.orgName,
    bottom_bg_image_url: `${saasDomainURL}/mail/bottom-bg.png`,
    hero_banner: `${saasDomainURL}/mail/cloud-hero-section.png`,
    upgrade_notification: `${saasDomainURL}/mail/upgrade-scheduled.png`,
    instance_id: event.instance_id || event.instance_name,
    service_name: event.service_name,
    service_plan_name: event.source_product_tier_name,
    upgrade_date: `${new Date(
      event.scheduled_date // Sometimes, the scheduled_date is an empty string in the event payload
    ).toLocaleString("en-GB", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })} UTC`,
    is_scheduled:
      event.scheduling_event_type === "scheduled" && event.scheduled_date,
    username: upgradeEventObj.userName || event.user_name,
    support_email: supportEmail,
  });

  return {
    recepientEmail: email,
    subject: subject,
    message: message,
    senderName: upgradeEventObj.orgName,
  };
}

async function getUpgradeCompletedMailContent(
  upgradeEventObj,
  orgLogoURL,
  supportEmail
) {
  const email = upgradeEventObj.userEmail;
  const saasDomainURL = getSaaSDomainURL();
  const subject = "Your instance upgrade is complete";
  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "upgradeCompleted.ejs"
  );

  const event = upgradeEventObj.eventPayload;

  const message = await ejs.renderFile(templatePath, {
    logo_url: orgLogoURL,
    org_name: upgradeEventObj.orgName,
    bottom_bg_image_url: `${saasDomainURL}/mail/bottom-bg.png`,
    hero_banner: `${saasDomainURL}/mail/cloud-hero-section.png`,
    upgrade_notification: `${saasDomainURL}/mail/upgrade-completed.png`,
    instance_id: event.instance_id || event.instance_name,
    service_name: event.service_name,
    service_plan_name: event.source_product_tier_name,
    username: upgradeEventObj.userName || event.user_name,
    support_email: supportEmail,
  });

  return {
    recepientEmail: email,
    subject: subject,
    message: message,
    senderName: upgradeEventObj.orgName,
  };
}

module.exports = {
  getUpgradeScheduledMailContent,
  getUpgradeCompletedMailContent,
};
