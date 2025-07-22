import { createSlice } from "@reduxjs/toolkit";
import dateRange from "react-date-range/dist/components/DateRange";

export const filterSlice = createSlice({
  name: "filters",
  initialState: {
    filterApplied: false,
    range: {
      startDate: null,
      endDate: new Date(),
      key: "range",
    },
    startTime: new Date(),
    endTime: new Date(),
    cameras: [],
    species: [],
  },
  reducers: {
    setTimeRange: (state, action) => {
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
    },
    setFilterApplied: (state, action) => {
      state.filterApplied = action.payload;
    },
    setDateRange: (state, action) => {
      state.range = action.payload;
    },
    setCameras: (state, action) => {
      for(let i=0; i<action.payload.length; i++){
        if(typeof action.payload[i] == 'object'){
          let merged_ids = action.payload[i];
          action.payload.splice(i, 1);
          action.payload.push(merged_ids[0]);
          action.payload.push(merged_ids[1]);
        }
      }
      state.cameras = action.payload;
    },
    setSpecies: (state, action) => {
      state.species = action.payload;
    },
    resetFilters: (state) => {
      state.filterApplied = false;
      state.range = {
        startDate: null,
        endDate: new Date(),
        key: "range",
      };
      state.startTime = new Date();
      state.endTime = new Date();
      state.cameras = [];
      state.species = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDateRange, setCameras, setSpecies, setFilterApplied, setTimeRange, resetFilters } = filterSlice.actions;
export const selectFilters = (state) => state.filters;

export default filterSlice.reducer;
