import { createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import {showLoadingScreen, setSnackBar} from "../../reusable_components/site_data/siteDataSlice";
import {backend_url} from "../../App";




export const cameraSlice = createSlice({
  name: 'cameras',
  initialState: {
      cameras: {
          "count": 0,
          "next": null,
          "previous": null,
          "results": []
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
})

const Header = {};
export const getCameras = (url = `${backend_url}/core/api/camera/`) => (dispatch, getState) => {
  const allCameras = []; // Initialize an empty array to store all camera data

  const fetchData = (url) => {
    dispatch(showLoadingScreen(true));
    Header['Authorization'] = `Token ${localStorage.getItem("token")}`;
    let config = {
      headers: Header,
    };

    axios
      .get(url, config)
      .then((res) => {
       // allCameras.push(res.data.results); // Add the data from the current page to the array
          res.data.results.forEach(element => {
            allCameras.push(element)
          });

          
        if (res.data.next) {
          // If there's a 'next' link, call the function recursively with the next URL
          fetchData(res.data.next);
        } else {
          // If there's no more 'next' link, dispatch the entire array of data
          dispatch(setCameras({
            count: allCameras.length,
            next: null,
            previous: null,
            results: allCameras
          }));
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


// Action creators are generated for each case reducer function
export const { setCameras } = cameraSlice.actions
export const selectCameras = (state) => state.cameras.cameras;
export default cameraSlice.reducer

