const ejs = require("ejs");
const path = require("path");
const { getSaaSDomainURL } = require("../../utils/getSaaSDomainURL");

async function getDenySubscriptionMailContent(denySubsriptionEventObj, orgLogoURL) {
  const orgName = denySubsriptionEventObj.orgName;
  const email = denySubsriptionEventObj.userEmail;
  const serviceName = denySubsriptionEventObj.eventPayload.service_name;
  const servicePlanName = denySubsriptionEventObj.eventPayload.product_tier_name;

  const subject = `Your ${serviceName} - ${servicePlanName} subscription request denied`;

  const templatePath = path.resolve(__dirname, "..", "ejsTemplates", "denySubscriptionRequest.ejs");

  const baseURL = getSaaSDomainURL();

  const message = await ejs.renderFile(templatePath, {
    service_plan_name: servicePlanName,
    service_name: serviceName,
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/mail/cloud-hero-section.png`,
    deny_subscription_request: `${baseURL}/mail/deny-subscription-request.png`,
  });

  // const message = `
  //         <html>
  //             <body>
  //                 <p>Hello,</p>
  //                 <p>We regret to inform you that your subscription request for the ${servicePlanName} plan on ${serviceName} has been denied.</p>
  //                 <p>If you have any questions, please contact support.</p>
  //                 <p>Sincerely</p>
  //                 <p>The ${serviceName} Team</p>
  //             </body>
  //         </html>`;

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
  getDenySubscriptionMailContent,
};
