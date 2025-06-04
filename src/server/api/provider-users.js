const axios = require("../axios");
const ProviderAuthError = require("../utils/ProviderAuthError");
const withProviderTokenExpirationHanding = require("../utils/withProviderTokenExpirationHandling");

async function getProviderUsers() {
  try {
    const response = await axios.get("/org-users");
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new ProviderAuthError();
    } else {
      throw error;
    }
  }
}

module.exports = {
  getProviderUsers: withProviderTokenExpirationHanding(getProviderUsers),
};
