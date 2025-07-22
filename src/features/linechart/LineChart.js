import React, {useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import {getLineChart, selectLineChart} from "./lineChartSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectFilters} from "../filters/filterSlice";
import {CategoryScale, LinearScale, Chart, PointElement, LineElement} from 'chart.js';
import {convert_to_request_parameters} from "../../reusable_components/utilityfunctions";
Chart.register(CategoryScale,LinearScale, PointElement, LineElement);

export function LineChart() {
    const {line_chart} = useSelector(selectLineChart);
    const filters = useSelector(selectFilters);
    const dispatch = useDispatch();
     useEffect(() => {
         let result = convert_to_request_parameters(filters.range, filters.startTime, filters.endTime)
         dispatch(getLineChart(result.start, result.end));
         }, [filters])

     return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Line
                height="100px"
                data={line_chart}
                type="line"
                options={{
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    stacked: false,
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',

                        // grid line settings
                        grid: {
                          drawOnChartArea: true, // only want the grid lines for one axis to show up
                        },
                      },
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Chart.js Line Chart - Multi Axis'
                        }
                    }
                }}
            />
        </div>);
}

