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
};

module.exports = { eventTypes };
