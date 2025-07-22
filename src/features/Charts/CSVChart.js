import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Papa from 'papaparse';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CSVChart({ selectedCamera, selectedField }) {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/feeds.csv'); // Adjust the path as needed
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          setData(result.data);
          const uniqueDates = Array.from(new Set(result.data.map((row) => {
            // Extract the date part from row.created_at
            const date = new Date(row.created_at);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Month is 0-based
            const day = date.getDate();
            return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
          })));
          
          if (uniqueDates.length > 0) {
            const fDate = uniqueDates[0];
            setSelectedDate(new Date(fDate));
          }
        },
      });
    }

    fetchData();
  }, []);

  // Extract all unique dates from your data
  const uniqueDates = Array.from(
    new Set(data.map((row) =>{
      if (typeof row.created_at === 'string') {
        // Convert the date to a string before extracting the date part
        const dateAsString = row.created_at.toString();
        const datePart = dateAsString.split('T')[0];
        return datePart;
      } else {
        // Handle the case where row.created_at is not a string (e.g., already a date object)
        // You may need to adjust this part based on your actual data structure.
        // For example, you might need to extract the date from a date object differently.
        const date = new Date(row.created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Month is 0-based in JavaScript Date objects
        const day = date.getDate();
        const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        return formattedDate ;
      }}))
  );

  // Set the minimum and maximum selectable dates based on your data
  const minSelectableDate = uniqueDates[0];
  const maxSelectableDate = uniqueDates[uniqueDates.length - 1];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  const renderChart = () => {
    let filteredData = data;

    if (selectedDate) {
      const selectedDay = selectedDate.toISOString().split('T')[0]; // Get the selected day in YYYY-MM-DD format

      filteredData = data.filter((row) => {
        // Check if row.created_at is a string before splitting
        if (typeof row.created_at === 'string') {
          // Convert the date to a string before extracting the date part
          const dateAsString = row.created_at.toString();
          const datePart = dateAsString.split('T')[0];
          return datePart === selectedDay;
        } else {
          // Handle the case where row.created_at is not a string (e.g., already a date object)
          // You may need to adjust this part based on your actual data structure.
          // For example, you might need to extract the date from a date object differently.
          const date = new Date(row.created_at);
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // Month is 0-based in JavaScript Date objects
          const day = date.getDate();
          const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
          return formattedDate === selectedDay;
        }
      });
    }
  // Group data by hours or days and render the chart accordingly
  let maxValues = [];
  let minValues = [];

    // Group data by hours and render the chart accordingly
    let hourlyData = {};

    // Group data by hours
    hourlyData = filteredData.reduce((acc, row) => {
      const date = new Date(row.created_at);
      const hour = date.getHours();

      if (!acc[hour]) {
        acc[hour] = { hour, values: [] };
      }

      acc[hour].values.push(row[selectedField]); // Assuming field1 contains the data you want to plot

      return acc;
    }, {});
    Object.values(hourlyData).forEach((hourData) => {
      const values = hourData.values;
      const max = Math.max(...values); // Get the maximum value
      let min = Math.min(...values.filter(val => val > 0)); // Get the minimum non-zero value
 

      maxValues.push(max);
      minValues.push(min);
    });
    // Create the chart options
    let options = {
      chart: {
        type: 'line',
      },
      title: {
        text: selectedCamera + ' Data for Selected Date',
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Hour',
        },
        categories: Object.keys(hourlyData).map((hour) => `${hour}:00`),
      },
      yAxis: {
        title: {
          text: 'Value',
        },
      },
      series: [
        {
          name: 'Max Value',
          data: maxValues,
        },
        {
          name: 'Min Value',
          data: minValues,
        },
      ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
  };

  return (
    <div>
      
      <div style={{margin:'10px'}}><label style={{marginRight:'10px'}}>Selete a Date</label>
      <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select Date"
          minDate={new Date(minSelectableDate)}
          maxDate={new Date(maxSelectableDate)}
        />
      </div>
      {data.length > 0 ? renderChart() : <p>Loading data...</p>}
    </div>
  );
}

export default CSVChart;
