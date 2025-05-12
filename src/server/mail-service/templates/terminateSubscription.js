const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getSubscriptionTerminateMailContent(terminateSubsriptionEventObj, orgLogoURL) {
  const orgName = terminateSubsriptionEventObj.orgName;
  const email = terminateSubsriptionEventObj.userEmail;
  const serviceName = terminateSubsriptionEventObj.eventPayload.service_name;
  const servicePlanName = terminateSubsriptionEventObj.eventPayload.product_tier_name;

  const subject = `Your ${serviceName} - ${servicePlanName} subscription terminated`;

  const templatePath = path.resolve(__dirname, "..", "ejsTemplates", "terminateSubscription.ejs");

  const baseURL = getSaaSDomainURL();

  const message = await ejs.renderFile(templatePath, {
    service_plan_name: servicePlanName,
    service_name: serviceName,
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/mail/cloud-hero-section.png`,
    terminate_subscription: `${baseURL}/mail/terminate-subscription.png`,
  });

  // const message = `
  //             <html>
  //                 <body>
  //                     <p>Hello,</p>
  //                     <p>Your ${servicePlanName} subscription on ${serviceName} has been terminated. You will no longer have access to the plan's features.  If you believe this was in error, please contact support.</p>
  //                     <p>If you have any questions, please contact support.</p>
  //                     <p>Sincerely,</p>
  //                     <p>The ${serviceName} Team</p>
  //                 </body>
  //             </html>`;

  const recepientEmail = email;

  let mailContent = null;
  if (orgName && serviceName && servicePlanName && recepientEmail) {
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
  getSubscriptionTerminateMailContent,
};
