function getSaaSDomainURL() {
  //check if Domain Alias is set
  let saasURL = process.env.YOUR_SAAS_DOMAIN_ALIAS;

  //if Domain Alias is not set, use the SaaS Domain URL value
  if (!saasURL || saasURL === "undefined") {
    saasURL = process.env.YOUR_SAAS_DOMAIN_URL;
  }
  //If the URL does not start with http:// or https://, prepend https:// to the URL
  if (saasURL && !saasURL.startsWith("http://") && !saasURL.startsWith("https://")) {
    saasURL = "https://" + saasURL;
  }

  return saasURL?.toLowerCase();
}

module.exports = {
  getSaaSDomainURL,
};
