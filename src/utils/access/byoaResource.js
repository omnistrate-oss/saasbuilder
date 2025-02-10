export function checkIfResouceIsBYOA(id) {
  if (!id) {
    return false;
  }
  return id?.includes("r-injectedaccountconfig");
}

export function isCloudAccountInstance(instance) {
  return instance?.resourceID?.includes("r-injectedaccountconfig");
}
