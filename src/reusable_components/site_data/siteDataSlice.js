/* eslint-disable no-param-reassign */

import { createSlice } from "@reduxjs/toolkit";

export const siteDataSlice = createSlice({
  name: "site_data",
  initialState: {
    side_nav: false,
    show: false,
    message: "",
    loadingScreen: false,
  },
  reducers: {
    resetSnackBar: (state) => {
      state.show = false;
      state.message = "";
    },
    setSnackBar: (state, action) => {
      state.show = true;
      state.message = action.payload;
    },
    showSideNav: (state) => {
      state.side_nav = !state.side_nav;
    },
    showLoadingScreen: (state, action) => {
      state.loadingScreen = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { showLoadingScreen, resetSnackBar, setSnackBar, showSideNav } = siteDataSlice.actions;

export const selectSiteData = (state) => state.site_data;

export default siteDataSlice.reducer;
