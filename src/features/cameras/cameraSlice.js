/* eslint-disable no-param-reassign */

import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { showLoadingScreen, setSnackBar } from "../../reusable_components/site_data/siteDataSlice";
import backendUrl from "../../config";

export const cameraSlice = createSlice({
  name: "cameras",
  initialState: {
    cameras: {
      count: 0,
      next: null,
      previous: null,
      results: [],
    },
  },
  reducers: {
    setCameras: (state, action) => {
      state.cameras.count = action.payload.count;
      state.cameras.next = action.payload.next;
      state.cameras.previous = action.payload.previous;
      state.cameras.results = action.payload.results;
    },
  },
});

export const { setCameras } = cameraSlice.actions;

export const getCameras =
  (url = `${backendUrl}/core/api/camera/`) =>
  (dispatch) => {
    const allCameras = [];

    const fetchData = (nextUrl) => {
      dispatch(showLoadingScreen(true));
      const Header = {
        Authorization: `Token ${localStorage.getItem("token")}`,
      };

      const config = {
        headers: Header,
      };

      axios
        .get(nextUrl, config)
        .then((res) => {
          res.data.results.forEach((element) => {
            allCameras.push(element);
          });

          if (res.data.next) {
            fetchData(res.data.next);
          } else {
            dispatch(
              setCameras({
                count: allCameras.length,
                next: null,
                previous: null,
                results: allCameras,
              })
            );
          }
        })
        .catch((err) => {
          dispatch(setSnackBar(err.response.data.non_field_errors[0]));
        })
        .finally(() => {
          dispatch(showLoadingScreen(false));
        });
    };

    fetchData(url);
  };

export const selectCameras = (state) => state.cameras.cameras;
export default cameraSlice.reducer;
