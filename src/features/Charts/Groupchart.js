import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Papa from 'papaparse';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, eachDayOfInterval } from 'date-fns';

function Groupchart() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [csvDates, setCsvDates] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/karimabadcamera.csv');
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

    const selectedDay = formatDate(selectedDate, 'MMM-dd-yyyy', { awareOfUnicodeTokens: true });

    const weekStart = addDays(selectedDate, -selectedDate.getDay()); // Start of the week
    const weekEnd = addDays(weekStart, 6); // End of the week

    const weeklyData = Array.from({ length: 7 }, () => ({ charging: 0, discharging: 0 }));

    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    weekDays.forEach((day, index) => {
      const dayData = data.filter((row) => row.Date_Time.includes(format(day, 'MMM-dd-yyyy')));
      const dailyAverages = calculateDailyAverages(dayData);
      weeklyData[index] = dailyAverages;
    });

    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: `Charging and Usage Durations of the Battery`,
      },
      xAxis: {
        categories: weekDays.map((day) => format(day, 'EEE/MMM-dd-yyyy')),
        title: {
          text: 'Day of the Week',
        }
      },
      yAxis: {
        title: {
          text: 'Duration (hours)',
        },
      },
      series: [
        {
          name: 'Charging',
          data: weeklyData.map((dayData) => dayData.charging),
        },
        {
          name: 'Usage',
          data: weeklyData.map((dayData) => dayData.discharging),
        },
      ],
      legend: {
        enabled: true,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
      },
    };

    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };

  const calculateDailyAverages = (dailyData) => {
    const hourlyAverages = Array.from({ length: 24 }, () => ({ count: 0, total: 0 }));

    dailyData.forEach((row) => {
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

    const dailyAverages = {
      charging: 0,
      discharging: 0,
    };

    for (let i = 1; i < 24; i++) {
      if (hourlyAveragePoints[i].y > hourlyAveragePoints[i - 1].y) {
        dailyAverages.charging += 1;
      } else if (hourlyAveragePoints[i].y < hourlyAveragePoints[i - 1].y) {
        dailyAverages.discharging += 1;
      }
    }

    return dailyAverages;
  };

  const formatDate = (date) => {
    return format(date, 'MMM-dd-yyyy', { awareOfUnicodeTokens: true });
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
          dateFormat="MMM-dd-yyyy"
          includeDates={csvDates.map((date) => new Date(date))}
        />
      </div>
      {renderChart()}
    </div>
  );
}

export default Groupchart;
