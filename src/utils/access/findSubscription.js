const ROLE_TYPES = {
  ROOT: "root",
  EDITOR: "editor",
  READER: "reader",
};

//If a user has multiple subscriptions this function finds the subscriptions by priority.Priority roder is as follows
//first find default subscription
//else find subscription root role
//else find subscription with editor role
//else find subscription with reader role

export const findSubscriptionByPriority = (subscriptions, serviceId, productTierId) => {
  if (!subscriptions || !subscriptions?.length) {
    return null;
  }

  const filteredList = subscriptions?.filter(
    (item) => item?.serviceId === serviceId && item?.productTierId === productTierId
  );

  if (!filteredList?.length) {
    return null;
  }

  const defaultSubscription = filteredList?.find((item) => item?.defaultSubscription);
  if (defaultSubscription) {
    return defaultSubscription;
  }

  const rootSubscription = filteredList?.find((item) => item?.roleType === ROLE_TYPES.ROOT);
  if (rootSubscription) {
    return rootSubscription;
  }

  const editorSubscription = filteredList?.find((item) => item?.roleType === ROLE_TYPES.EDITOR);
  if (editorSubscription) {
    return editorSubscription;
  }

  const readerSubscription = filteredList?.find((item) => item?.roleType === ROLE_TYPES.READER);
  if (readerSubscription) {
    return readerSubscription;
  }
};

export const checkSubscriptionIsForProductTier = (subscription, serviceId, productTierId) => {
  return subscription?.serviceId === serviceId && subscription?.productTierId === productTierId;
};
