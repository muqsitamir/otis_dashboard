import React, {useEffect} from 'react';
import {Pie} from 'react-chartjs-2';
import {getPieChart, selectPieChart} from "./pieChartSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectFilters} from "../filters/filterSlice";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import {convert_to_request_parameters} from "../../reusable_components/utilityfunctions";
ChartJS.register(ArcElement, Tooltip, Legend);


export function PieChart() {
    const {pie_chart} = useSelector(selectPieChart);
    const filters = useSelector(selectFilters);
    const dispatch = useDispatch();

     useEffect(() => {
         let result = convert_to_request_parameters(filters.range, filters.startTime, filters.endTime)
         dispatch(getPieChart(result.start, result.end));
         }, [filters])

     return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Pie
                height="300px"
                data={pie_chart}
                type="pie"
                options={{
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Chart.js Line Chart'
                        }
                    }
                }}
            />
        </div>);
}

