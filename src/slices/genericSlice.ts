import { createSlice } from "@reduxjs/toolkit";

interface GenericState {
  instanceListSummaryVisible: boolean;
  instanceDetailsSummaryVisible: boolean;
}

const initialState: GenericState = {
  instanceListSummaryVisible: true,
  instanceDetailsSummaryVisible: true,
};

const genericSlice = createSlice({
  name: "generic",
  initialState,
  reducers: {
    toggleInstanceListSummaryVisibility: (state) => {
      state.instanceListSummaryVisible = !state.instanceListSummaryVisible;
    },
    toggleInstanceDetailsSummaryVisibility: (state) => {
      state.instanceDetailsSummaryVisible = !state.instanceDetailsSummaryVisible;
    },
  },
});

export const { toggleInstanceDetailsSummaryVisibility, toggleInstanceListSummaryVisibility } = genericSlice.actions;

export default genericSlice.reducer;

export const selectInstanceListSummaryVisibility = (state) => state.generic.instanceListSummaryVisible;

export const selectInstanceDetailsSummaryVisibility = (state) => state.generic.instanceDetailsSummaryVisible;
