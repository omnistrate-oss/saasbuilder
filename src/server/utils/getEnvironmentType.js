const { ENVIRONMENT_TYPES } = require("../utils/constants/environmentTypes");

function getEnvironmentType() {
  const environmentType = process.env.ENVIRONMENT_TYPE || ENVIRONMENT_TYPES.PROD;
  return environmentType;
}

module.exports = {
  getEnvironmentType,
};
