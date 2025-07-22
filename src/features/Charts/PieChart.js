import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Papa from 'papaparse';

const PieChart = ({ cameraId }) => {
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
          const filteredData = result.data.filter((item) => item['Camera ID'] === cameraId);
          setData(filteredData);
        },
      });
    }
    fetchData();
  }, [cameraId]);

  Highcharts.setOptions({
    time: {
      useUTC: false,
      timezone: 'Asia/Karachi',
    },
  });

  // Calculate the sum of event counts for different event types
  const totalPersonDayEventCount = data.reduce(
    (sum, item) => sum + (item['Person Day Event Count'] || 0),
    0
  );
  const totalPersonNightEventCount = data.reduce(
    (sum, item) => sum + (item['Person Night Event Count'] || 0),
    0
  );
  const totalAnimalDayEventCount = data.reduce(
    (sum, item) => sum + (item['Animal Day Event Count'] || 0),
    0
  );
  const totalAnimalNightEventCount = data.reduce(
    (sum, item) => sum + (item['Animal Night Event Count'] || 0),
    0
  );
  const totalVehicleDayEventCount = data.reduce(
    (sum, item) => sum + (item['Vehicle Day Event Count'] || 0),
    0
  );
  const totalVehicleNightEventCount = data.reduce(
    (sum, item) => sum + (item['Vehicle Night Event Count'] || 0),
    0
  );

  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Pie Chart',
    },
    series: [
      {
        name: 'Event Types',
        data: [
          {
            name: 'Person Day Event Count',
            y: totalPersonDayEventCount,
          },
          {
            name: 'Person Night Event Count',
            y: totalPersonNightEventCount,
          },
          {
            name: 'Animal Day Event Count',
            y: totalAnimalDayEventCount,
          },
          {
            name: 'Animal Night Event Count',
            y: totalAnimalNightEventCount,
          },
          {
            name: 'Vehicle Day Event Count',
            y: totalVehicleDayEventCount,
            color:'pink'
          },
          {
            name: 'Vehicle Night Event Count',
            y: totalVehicleNightEventCount,
          },
        ],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
