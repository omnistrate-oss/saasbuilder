const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getUpgradeScheduledMailContent(upgradeEventObj, orgLogoURL) {
  const email = upgradeEventObj.userEmail;
  const saasDomainURL = getSaaSDomainURL();
  const subject = "Your instance is scheduled for a version upgrade";
  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "upgradeScheduled.ejs"
  );

  const message = await ejs.renderFile(templatePath, {
    logo_url: orgLogoURL,
    org_name: upgradeEventObj.orgName,
    bottom_bg_image_url: `${saasDomainURL}/mail/bottom-bg.png`,
    hero_banner: `${saasDomainURL}/mail/cloud-hero-section.png`,
    upgrade_notification: `${saasDomainURL}/mail/upgrade-scheduled.png`,
    instance_name: upgradeEventObj.eventPayload.instance_name,
    service_name: upgradeEventObj.eventPayload.service_name,
    service_plan_name: upgradeEventObj.eventPayload.source_product_tier_name,
    upgrade_date: `${new Date(
      upgradeEventObj.eventPayload.scheduled_date
    ).toLocaleString("en-GB", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })} UTC`,
    username:
      upgradeEventObj.userName || upgradeEventObj.eventPayload.user_name,
  });

  return {
    recepientEmail: email,
    subject: subject,
    message: message,
    senderName: upgradeEventObj.orgName,
  };
}

async function getUpgradeCompletedMailContent(upgradeEventObj, orgLogoURL) {
  const email = upgradeEventObj.userEmail;
  const saasDomainURL = getSaaSDomainURL();
  const subject = "Your instance upgrade is complete";
  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "upgradeCompleted.ejs"
  );

  const message = await ejs.renderFile(templatePath, {
    logo_url: orgLogoURL,
    org_name: upgradeEventObj.orgName,
    bottom_bg_image_url: `${saasDomainURL}/mail/bottom-bg.png`,
    hero_banner: `${saasDomainURL}/mail/cloud-hero-section.png`,
    upgrade_notification: `${saasDomainURL}/mail/upgrade-completed.png`,
    instance_name: upgradeEventObj.eventPayload.instance_name,
    service_name: upgradeEventObj.eventPayload.service_name,
    service_plan_name: upgradeEventObj.eventPayload.source_product_tier_name,
    username:
      upgradeEventObj.userName || upgradeEventObj.eventPayload.user_name,
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
