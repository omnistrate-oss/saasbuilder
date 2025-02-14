export const logoutBroadcastChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("logout-channel")
    : null;
