import {createSlice} from '@reduxjs/toolkit'
import axios from "axios";
import {setSnackBar, showLoadingScreen} from "../../reusable_components/site_data/siteDataSlice";
import {backend_url} from "../../App";
import {selectFilters} from "../filters/filterSlice";


export const lineChartSlice = createSlice({
  name: 'line_chart',
  initialState: {
      line_chart: {
          labels: [],
          datasets: [

          ]
      }
  },
  reducers: {
      setLineChart: (state, action) => {
          state.line_chart = {
            labels: action.payload.labels,
            datasets: action.payload.datasets
          }
      },
  },
})

const Header = {};

export const getLineChart = (start_date, end_date) => (dispatch, getState) => {
    dispatch(showLoadingScreen(true));
    Header["Authorization"] = `Token ${localStorage.getItem("token")}`;
    dispatch(showLoadingScreen(true));
    let config = {
        headers: Header,
    };
    const filters = selectFilters(getState());
    let cameras_selected = filters.cameras.join(",");
    let species_selected = filters.species.join(",");

    end_date = end_date.slice(0,end_date.indexOf('T'))
    start_date = start_date.slice(0,start_date.indexOf('T'))

    axios.get(`${backend_url}/core/api/event/linechart/?date_gte=${start_date}&date_lte=${end_date}&cameras=${cameras_selected}&species=${species_selected}`, config).then(res => {
        dispatch(setLineChart(res.data));

    }).catch(err => {
        dispatch(setSnackBar(err.message));
    }).finally(() => {
        dispatch(showLoadingScreen(false));
    });
};


// Action creators are generated for each case reducer function
export const { setLineChart } = lineChartSlice.actions;
export const selectLineChart = (state) => state.line_chart;
export default lineChartSlice.reducer;
