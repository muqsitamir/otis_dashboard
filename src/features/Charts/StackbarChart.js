import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Papa from 'papaparse';

const StackedBarChart = ({cameraId}) => {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    // Read data from CSV file
    async function fetchData() {
        const response = await fetch('/wwf_camera_trap.csv'); // Adjust the path as needed
        const text = await response.text();
  
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
          
            const filteredData = result.data.filter(item => item['Camera ID'] === cameraId);
            setData(filteredData);
        console.log("stackbar data"+filteredData)
      },
    });}
    fetchData();
  }, [cameraId]);

  //const filteredData = data.filter(item => item['Camera ID'] === cameraId);
  Highcharts.setOptions({
    time: {
      useUTC: false,
      timezone: 'Asia/Karachi',
    },
  });
  const options = {
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Stacked Bar Chart',
    },
    xAxis: {
      categories: data.map(item => `Camera ${item['Camera ID']}`),
    },
    yAxis: {
      title: {
        text: 'Event Count',
      },
    },
    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },
    series: [
      
      {
        name: 'Person Day Event Count',
        data: data.map((item) => item['Person Day Event Count']),
      },
      {
        name: 'Person Night Event Count',
        data: data.map((item) => item['Person Night Event Count']),
      },
      {
        name: 'Animal Day Event Count',
        data: data.map((item) => item['Animal Day Event Count']),
      },
      {
        name: 'Animal Night Event Count',
        data: data.map((item) => item['Animal Night Event Count']),
        color:'brown'
      },
      {
        name: 'Vehicle Day Event Count',
        data: data.map((item) => item['Vehicle Day Event Count']),
      },
      {
        name: 'Vehicle Night Event Count',
        data: data.map((item) => item['Vehicle Night Event Count']),
      },
      // Add other series here for different event types.
    ],
  };

  

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default StackedBarChart;
