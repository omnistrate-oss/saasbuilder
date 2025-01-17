import { configureStore } from "@reduxjs/toolkit";
import providerSlice from "./slices/providerSlice";
import marketplaceServicesSlice from "./slices/marketplaceServices";
import resourceInstanceListSlice from "./slices/resourceInstanceListSlice";
import regionSlice from "./slices/regionSlice";
import eventsSlice from "./slices/eventsSlice";
import subscriptionsSlice from "./slices/subscriptionsSlice";
import userDataSlice from "./slices/userDataSlice";
import genericSlice from "./slices/genericSlice";

export const store = configureStore({
  reducer: {
    provider: providerSlice,
    marketplaceServices: marketplaceServicesSlice,
    resourceInstanceList: resourceInstanceListSlice,
    region: regionSlice,
    events: eventsSlice,
    subscriptions: subscriptionsSlice,
    user: userDataSlice,
    generic: genericSlice,
  },
});
