import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Papa from 'papaparse';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function Chart() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [csvDates, setCsvDates] = useState([]); // Array to store unique dates from CSV

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/karimabadcamera.csv'); // Adjust the path as needed
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          setData(result.data);
          const uniqueDates = Array.from(new Set(result.data.map((row) => row.Date_Time)));
          setCsvDates(uniqueDates);
          // Find the last date and set it as the default date
        if (uniqueDates.length > 0) {
          const lastDate = new Date(uniqueDates[uniqueDates.length - 1]);
          setSelectedDate(lastDate);
        }
        },
      });
    }

    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const renderChart = () => {
    if (!selectedDate) {
      return <p>Select a date to view data.</p>;
    }

    const selectedDay = formatDate(selectedDate, 'MMM-dd-yyyy', { awareOfUnicodeTokens: true });

    const filteredData = data.filter((row) => row.Date_Time.includes(selectedDay));
    // Calculate hourly averages

 
    if (filteredData.length === 0) {
      return <p>No data available for the selected date.</p>;
    }

   
    const hourlyAverages = Array.from({ length: 24 }, () => ({ count: 0, total: 0 }));

    filteredData.forEach((row) => {
      const timestamp = new Date(row.Date_Time).getTime();
      const hour = new Date(timestamp).getHours();
      const volts = parseFloat(row.Volts);
      
      hourlyAverages[hour].count++;
      hourlyAverages[hour].total += volts;
    });
    const hourlyAveragePoints = hourlyAverages.map((hourlyData, hour) => {
      const average = hourlyData.count > 0 ? hourlyData.total / hourlyData.count : 0;
      const xValue = new Date(selectedDate).setHours(hour);
      return { x: xValue, y: average };
    });
    for (let i = 1; i < 24; i++) {
      if (hourlyAveragePoints[i].y > hourlyAveragePoints[i - 1].y) {
        hourlyAverages[i].trend = 'charging';
      } else if (hourlyAveragePoints[i].y < hourlyAveragePoints[i - 1].y) {
        hourlyAverages[i].trend = 'discharging';
      }  
    }
     
    let lowestVolts = Infinity; // Initialize to positive infinity
    let lowestVoltsTimestamp = null;
    let highestVolts = -Infinity; // Initialize to negative infinity
    let highestVoltsTimestamp = null;

    hourlyAveragePoints.forEach((point) => {
      const volts = point.y;
      const timestamp = point.x;

      if (!isNaN(volts) && volts !== 0) {
        if (volts < lowestVolts) {
          lowestVolts = volts;
          lowestVoltsTimestamp = timestamp;
        }
        if (volts > highestVolts) {
          highestVolts = volts;
          highestVoltsTimestamp = timestamp;
        }
      }
    });

    console.log(`Lowest volts of the day: ${lowestVolts}`);
    console.log(`Highest volts of the day: ${highestVolts}`);

    // Calculate the time duration between lowest and highest volts
    let voltsDuration = null;
    if (lowestVoltsTimestamp && highestVoltsTimestamp) {
      voltsDuration = (highestVoltsTimestamp - lowestVoltsTimestamp) / (1000 * 60 * 60); // Duration in hours
    }

    console.log(`Time duration between lowest and highest volts: ${voltsDuration} hours`);

    let nextLowestVolts = Infinity;
    let nextLowestVoltsTimestamp = null;

    hourlyAveragePoints.forEach((point) => {
      const volts = point.y;
      const timestamp = point.x;

      if (!isNaN(volts) && volts !== 0 && timestamp > highestVoltsTimestamp) {
        if (volts < nextLowestVolts) {
          nextLowestVolts = volts;
          nextLowestVoltsTimestamp = timestamp;
        }
      }
    });
    // Calculate the time duration between lowest and highest volts
    let voltsDuration1 = null;
    if (nextLowestVoltsTimestamp && highestVoltsTimestamp) {
      voltsDuration1 = (nextLowestVoltsTimestamp-highestVoltsTimestamp) / (1000 * 60 * 60); // Duration in hours
    }
   /* const dataPoints = filteredData.map((row, index) => ({
      x: new Date(row.Date_Time).getTime(),
      y: parseFloat(row.Volts),
      //color: index > 0 && row.Volts < parseFloat(filteredData[index - 1].Volts) ? 'red' : 'green',
    }));*/
// Create a data series for charging and discharging trends
const trendData = hourlyAverages.map((hourlyData, hour) => {
  const average = hourlyAveragePoints[hour].y;
  const xValue = hourlyAveragePoints[hour].x;
  const trend = hourlyData.trend;

  // Set the color to black if the average is zero
 /* const color = average === 0 ? 'black' : (trend === 'charging' ? 'green' : 'red');*/

  return { x: xValue, y: average, trend };
});
    Highcharts.setOptions({
      time: {
        useUTC: false,
        timezone: 'Asia/Karachi',
      },
    });
    const options = {
      chart: {
        type: 'line',
      },
      title: {
        text: `Time and Voltage `
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Time', // Set x-axis title
        }, 
      },
      yAxis: {
        title: {
          text: 'Volts',
        },
      },
      series: [
       /* {
          name: 'Volts',
          data: dataPoints,
         /* dataLabels: {
            enabled: true,
            formatter: function () {
              const index = this.point.index;
              const color = this.point.color;
              const voltage = this.point.y;
    
              // Add your condition to determine the name
            if (index > 0 && voltage < dataPoints[index - 1].y) {
                return 'Discharging';
              } else {
               return 'Charging';
              }
            },
          },
        },
        {
          name: 'Hourly Average',
          data: hourlyAveragePoints,
          
        },*/
        {
          name: 'Trend',
          data: trendData,
          marker: {
            enabled: true,
            radius: 5,
          },
          color: 'black', // Color for the trend line
          lineWidth: 2, // Adjust line width as needed
          type: 'line',
        },
      ],
      legend: {
        enabled: true, // Set to false to hide the legend
        layout: 'horizontal', // 'horizontal' or 'vertical'
        align: 'center', // 'left', 'center', or 'right'
        verticalAlign: 'bottom', // 'top', 'middle', or 'bottom'
        itemStyle: {
          // Style for the legend items
          color: '#333', // Text color
        },
        itemHoverStyle: {
          // Style for legend items on hover
          color: 'blue',
        },
      },
     
     
    };

    return (
      <div>
        
        <HighchartsReact highcharts={Highcharts} options={options} />
        <div style={{    display: 'flex',alignItems: 'center',justifyContent: 'space-around'}}>   
        <div><strong>Charging Periods:</strong>
        <div>
        {format(lowestVoltsTimestamp, 'HH:mm')} - {format(highestVoltsTimestamp, 'HH:mm')} ({voltsDuration} hours)
        </div>
        </div>
        <div><strong>Usage Periods:</strong>
        <div>
        {format(highestVoltsTimestamp, 'HH:mm')} - {format(nextLowestVoltsTimestamp, 'HH:mm')} ({voltsDuration1} hours)
        </div>
        </div> </div>
      </div>
    );
  };

  const formatDate = (date) => {
    return format(date, 'MMM-dd-yyyy', { awareOfUnicodeTokens: true });
  };

  return (
    <div>
      <div style={{margin:'10px'}}><label style={{marginRight:'10px'}}>Selete a Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select Date"
          minDate={new Date(csvDates[0])}
          maxDate={new Date(csvDates[csvDates.length - 1])}
          dateFormat="MMM-dd-yyyy" // Update the date format here
          includeDates={csvDates.map((date) => new Date(date))} // Map dates to Date objects
        />
      </div>
      {renderChart()}
      
    </div>
  );
}

export default Chart;
