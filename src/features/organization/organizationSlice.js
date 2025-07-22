import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import backendUrl from "config";

export const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    organization: {
      name: "",
      cameras: [],
      species: [],
      can_annotate: false,
      can_unannotate: false,
      can_feature: false,
      can_delete: false,
    },
  },
  reducers: {
    setOrganization: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.organization = action.payload;
    },
    clearOrganization: (state) => {
      // eslint-disable-next-line no-param-reassign
      state.organization = null;
    },
  },
});

// Action creators
export const { setOrganization, clearOrganization } = organizationSlice.actions;

// Thunk to fetch organization data
export const getOrganization = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    const response = await axios.get(`${backendUrl}/core/api/organization/`, config);
    dispatch(setOrganization(response.data));
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log(false);
  }
};

// Selector to get organization state
export const selectOrganization = (state) => state.organization.organization;

// Default export
export default organizationSlice.reducer;
