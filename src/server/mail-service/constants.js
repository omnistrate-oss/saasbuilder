const eventTypes = {
  CustomerSignUp: "CustomerSignUp",
  InviteUser: "InviteUser",
  RevokeUserRole: "RevokeUserRole",
  ResetPassword: "ResetPassword",
  ApproveSubscriptionRequest: "ApproveSubscriptionRequest",
  DenySubscriptionRequest: "DenySubscriptionRequest",
  SuspendSubscription: "SuspendSubscription",
  ResumeSubscription: "ResumeSubscription",
  TerminateSubscription: "TerminateSubscription",
  InvoiceCreated: "InvoiceCreated",
  InstanceMaintenanceScheduled: "InstanceMaintenanceScheduled",
  InstanceMaintenanceCompleted: "InstanceMaintenanceCompleted",
  DisconnectAccountComplete: "DisconnectAccountComplete",
  ConnectAccountComplete: "ConnectAccountComplete",
  PendingRevokePermissions: "PendingRevokePermissions",
  PendingRestorePermissions: "PendingRestorePermissions",
};

module.exports = { eventTypes };
