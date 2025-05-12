import { configureStore } from "@reduxjs/toolkit";

import genericSlice from "./slices/genericSlice";
import userDataSlice from "./slices/userDataSlice";

export const store = configureStore({
  reducer: {
    user: userDataSlice,
    generic: genericSlice,
  },
});
