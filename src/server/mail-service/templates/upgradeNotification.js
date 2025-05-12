const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getUpgradeNotificationMailContent(
  notificationType, // upgradeScheduled or upgradeCompleted
  upgradeEventObj,
  orgLogoURL,
  supportEmail
) {
  const email = upgradeEventObj.userEmail;
  const saasDomainURL = getSaaSDomainURL();
  const event = upgradeEventObj.eventPayload;
  let subject = "";

  if (notificationType === "upgradeScheduled") {
    subject =
      event.scheduling_event_type === "scheduled"
        ? "Your instance is scheduled for a version upgrade"
        : event.scheduling_event_type === "reminder"
          ? "Your instance upgrade is scheduled for today"
          : "Your instance is being upgraded";
  } else {
    subject =
      event.completion_status === "SUCCESS"
        ? "Your instance upgrade is completed successfully"
        : event.completion_status === "CANCELLED"
          ? "Your instance upgrade has been cancelled"
          : event.completion_status === "SKIPPED"
            ? "Your instance upgrade has been skipped"
            : "Your instance upgrade is complete";
  }

  const templatePath = path.resolve(__dirname, "..", "ejsTemplates", "upgradeNotification.ejs");

  const message = await ejs.renderFile(templatePath, {
    logo_url: orgLogoURL,
    org_name: upgradeEventObj.orgName,
    bottom_bg_image_url: `${saasDomainURL}/mail/bottom-bg.png`,
    hero_banner: `${saasDomainURL}/mail/cloud-hero-section.png`,
    upgrade_notification_image_url: `${saasDomainURL}/mail/upgrade-scheduled.png`,
    instance_id: event.instance_id || event.instance_name,
    service_name: event.service_name,
    service_plan_name: event.source_product_tier_name,
    support_email: supportEmail,
    username: upgradeEventObj.userName || event.user_name || "",

    notification_type: notificationType,
    scheduled_date: event.scheduled_date // Sometimes, the scheduled_date is an empty string in the event payload
      ? `${new Date(event.scheduled_date).toLocaleString("en-GB", {
          timeZone: "UTC",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })} UTC`
      : "",
    scheduling_event_type: event.scheduling_event_type,
    completion_status: event.completion_status,
  });

  return {
    recepientEmail: email,
    subject: subject,
    message: message,
    senderName: upgradeEventObj.orgName,
  };
}

module.exports = {
  getUpgradeNotificationMailContent,
};
