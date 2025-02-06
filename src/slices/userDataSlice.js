import { createSelector, createSlice } from "@reduxjs/toolkit";
import loadingStatuses from "../utils/constants/loadingStatuses";

const initialState = {
  userData: {},
  orgUsers: [],
  userDataLoadingStatus: loadingStatuses.idle,
  orgUsersLoadingStatus: loadingStatuses.idle,
};

const userDataSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initialiseUserData: (state) => {
      state.userData = initialState.userData;
      state.orgUsers = initialState.orgUsers;
      state.userDataLoadingStatus = initialState.userDataLoadingStatus;
      state.orgUsersLoadingStatus = initialState.orgUsersLoadingStatus;
    },
    setUserData: (state, action) => {
      const userId = action.payload.id;
      state.userData[userId] = action.payload;
    },
    setOrgUsers: (state, action) => {
      state.orgUsers = action.payload.orgUsers;
    },
    setUserDataLoadingStatus: (state, action) => {
      state.userDataLoadingStatus = action.payload;
    },
    setOrgUsersLoadingStatus: (state, action) => {
      state.orgUsersLoadingStatus = action.payload;
    },
  },
});

export const {
  setOrgUsers,
  setOrgUsersLoadingStatus,
  setUserData,
  setUserDataLoadingStatus,
  initialiseUserData,
} = userDataSlice.actions;

export default userDataSlice.reducer;

export const selectUserData = createSelector(
  (state) => state.user.userData,
  (userData) => {
    return Object.values(userData);
  }
);

export const selectUserAllData = (state) => {
  return Object.values(state.user.userData);
};

export const selectUserrootData = createSelector(
  (state) => state.user.userData,
  (userData) => {
    const data = Object.values(userData)[0];
    if (!data) {
      return {};
    }
    return data;
  }
);

export const selectUserDataLoadingStatus = (state) => {
  const data = state.user.userDataLoadingStatus;
  return data;
};

export const selectOrgUsersLoadingStatus = (state) => {
  const data = state.user.orgUsersLoadingStatus;
  return data;
};

const serviceConsumptionUserRoles = [
  "editor",
  "reader",
  // "root",
  // "admin",
  // "operator",
];
const serviceCreationUserRoles = [
  "service_editor",
  "service_reader",
  "root",
  "admin",
  "service_operator",
];

export const selectServiceCreationOrgUsers = createSelector(
  (state) => state.user.orgUsers,
  (orgUsers) => {
    return orgUsers.filter((user) =>
      serviceCreationUserRoles.includes(user.roleType)
    );
  }
);

export const selectServiceConsumptionOrgUsers = createSelector(
  (state) => state.user.orgUsers,
  (orgUsers) => {
    return orgUsers.filter((user) =>
      serviceConsumptionUserRoles.includes(user.roleType)
    );
  }
);
