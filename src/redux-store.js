import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./slices/userDataSlice";
import genericSlice from "./slices/genericSlice";

export const store = configureStore({
  reducer: {
    user: userDataSlice,
    generic: genericSlice,
  },
});
