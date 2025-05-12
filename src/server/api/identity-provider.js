const axios = require("../axios");
const ProviderAuthError = require("../utils/ProviderAuthError");
const withProviderTokenExpirationHanding = require("../utils/withProviderTokenExpirationHandling");

function getIdentityProvidersList(payload) {
  return axios.get("/identity-provider", payload).catch((error) => {
    console.log("list identity provider error", error);
    if (error.response && error.response.status === 401) {
      throw new ProviderAuthError();
    } else {
      throw error;
    }
  });
}

module.exports = {
  getIdentityProvidersList: withProviderTokenExpirationHanding(getIdentityProvidersList),
};
