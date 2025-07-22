import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from "axios";
import { backend_url } from '../../App';
const DayPieChart = ({ cameraId,cameraName }) => {
  const [data, setData] = useState([]);
 

  const isDayEvent=(updated_at)=> {
    const eventDate = new Date(updated_at );
  //  console.log("Date: "+eventDate)
    const hour = eventDate.getHours();
    return hour >= 6 && hour < 18; // Assuming daytime is between 6 AM and 6 PM
  }
    // Read data from CSV file
    useEffect(() => {
      const fetchData = async (url) => {
        let result = [];
        const Header = { Authorization: `Token ${localStorage.getItem("token")}` };
        const config = {
          headers: Header,
        };
  
        const getData = async (url) => {
          try {
            const response = await axios.get(url, config);
            result = result.concat(response.data.results);
  
            if (response.data.next) {
              // If there's a 'next' link, fetch the next page
              await getData(response.data.next);
            } else {
              // If no 'next' link, set the data and stop loading
              setData(result);
             
              //setIsLoading(false);
            }
          } catch (err) {
            console.error("Error fetching data:", err);
            //setIsLoading(false);
          }
        };
  
        await getData(`${backend_url}/core/api/event/?cameras=${cameraId}`);
      };
  
      fetchData();
      //console.log('data is:'+data)
    }, [cameraId]);
   

  Highcharts.setOptions({
    time: {
      useUTC: false,
      timezone: 'Asia/Karachi',
    },
  });
  const totalDayEventCount=data.filter(entry => isDayEvent(entry.created_at)).length;
  const personDayCount = data.filter(entry => entry.species.some(species => species.id === "person" && isDayEvent(entry.created_at))).length;
  const animalDayCount = data.filter(entry => entry.species.some(species => species.id === "animal" && isDayEvent(entry.created_at))).length;
  const vehicleDayCount = data.filter(entry => entry.species.some(species => species.id === "vehicle" && isDayEvent(entry.created_at))).length;
  

  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: `Total Day Events ${totalDayEventCount}`,
    },
    series: [
      {
        name: 'Event Types',
        data: [
          
          {
            name: 'Person Day Event Count',
            y: personDayCount,
          },
          {
            name: 'Animal Day Event Count',
            y: animalDayCount,
          },
          {
            name: 'Vehicle Day Event Count',
            y: vehicleDayCount,
            color:'pink'
          }
        ],
      },
    ],
  };

  return  <HighchartsReact highcharts={Highcharts} options={options} style={{height:'100%'}}/>
};

export default DayPieChart;
