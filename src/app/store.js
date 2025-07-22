import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../features/filters/filterSlice";
import organizationReducer from "../features/organization/organizationSlice";
import eventsReducer from "../features/events/eventsSlice";
import pieChartReducer from "../features/piechart/pieChartSlice";
import lineChartReducer from "../features/linechart/lineChartSlice";
import cameraReducer from "../features/cameras/cameraSlice";

const store = configureStore({
  reducer: {
    filters: filterReducer,
    organization: organizationReducer,
    events: eventsReducer,
    pie_chart: pieChartReducer,
    line_chart: lineChartReducer,
    cameras: cameraReducer,
  },
});

export default store;
