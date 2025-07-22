// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import backendUrl from "config";
//
// // Define the slice
// export const cameraSlice = createSlice({
//   name: "cameras",
//   initialState: {
//     cameras: {
//       count: 0,
//       next: null,
//       previous: null,
//       results: [],
//     },
//   },
//   reducers: {
//     setCameras: (state, action) => {
//       // eslint-disable-next-line no-param-reassign
//       state.cameras.count = action.payload.count;
//       // eslint-disable-next-line no-param-reassign
//       state.cameras.next = action.payload.next;
//       // eslint-disable-next-line no-param-reassign
//       state.cameras.previous = action.payload.previous;
//       // eslint-disable-next-line no-param-reassign
//       state.cameras.results = action.payload.results;
//     },
//   },
// });
//
// // Export actions & selectors
// export const { setCameras } = cameraSlice.actions;
// export const selectCameras = (state) => state.cameras.cameras;
// export default cameraSlice.reducer;
//
// // Now safely define your thunk AFTER the slice
// const Header = {};
// export const getCameras =
//   (url = `${backendUrl}/core/api/camera/`) =>
//   (dispatch) => {
//     const allCameras = []; // Store all camera data
//
//     const fetchData = (fetchUrl = url) => {
//       Header.Authorization = `Token ${localStorage.getItem("token")}`;
//       const config = { headers: Header };
//
//       axios
//         .get(fetchUrl, config)
//         .then((res) => {
//           res.data.results.forEach((element) => {
//             allCameras.push(element);
//           });
//
//           if (res.data.next) {
//             fetchData(res.data.next); // Recurse if there's more data
//           } else {
//             dispatch(
//               setCameras({
//                 count: allCameras.length,
//                 next: null,
//                 previous: null,
//                 results: allCameras,
//               })
//             );
//           }
//         })
//         .catch((err) => {
//           console.log(err?.response?.data?.non_field_errors?.[0] || err.message);
//         })
//         .finally(() => {
//           console.log("Request complete");
//         });
//     };
//
//     fetchData();
//   };
