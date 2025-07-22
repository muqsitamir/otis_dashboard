import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Papa from 'papaparse';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Temp() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [csvDates, setCsvDates] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/temp.csv'); // Adjust the path as needed
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          setData(result.data);
          const uniqueDates = Array.from(new Set(result.data.map((row) => row.Date_Time)));
          setCsvDates(uniqueDates);

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

    const selectedDay = selectedDate.toDateString();

    const filteredData = data.filter((row) => row.Date_Time.includes(selectedDay));

    if (filteredData.length === 0) {
      return <p>No data available for the selected date.</p>;
    }

    const dataPoints = filteredData.map((row) => ({
      x: new Date(row.Date_Time).getTime(),
      y1: parseFloat(row.Volts),
      y2: parseFloat(row.Temp),
    }));

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
        text: `Temperature and Voltage `,
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Time',
        },
      },
      yAxis: [
        {
          title: {
            text: 'Voltage',
          },
        },
        {
          title: {
            text: 'Temperature (°C)',
          },
          opposite: true,
        },
      ],
      series: [
        {
          name: 'Voltage',
          data: dataPoints.map((point) => [point.x, point.y1]),
          yAxis: 0,
        },
        {
          name: 'Temperature',
          data: dataPoints.map((point) => [point.x, point.y2]),
          yAxis: 1,
        },
      ],
      legend: {
        enabled: true,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#333',
        },
        itemHoverStyle: {
          color: 'blue',
        },
      },
    };

    return (
      <div>
        <div style={{ margin: '10px' }}>
          <label style={{ marginRight: '10px' }}>Select a Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select Date"
            minDate={new Date(csvDates[0])}
            maxDate={new Date(csvDates[csvDates.length - 1])}
            dateFormat="EEE, MMM dd, yyyy"
            includeDates={csvDates.map((date) => new Date(date))}
          />
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };

  return (
    <div>
      {renderChart()}
    </div>
  );
}

export default Temp;
