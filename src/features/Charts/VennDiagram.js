import React, { useEffect, useState } from 'react';
import * as d3 from "d3";
import * as venn from "venn.js";

import axios from "axios";
import { backend_url } from '../../App';
const VennDiagram = ({cameraId}) => {
    const [data, setData] = useState([]);
   
    const isDayEvent=(updated_at)=> {
        const eventDate = new Date(updated_at);
       // console.log("Date: "+eventDate)
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
       
    
      const totalEvent=data.length;
      const totalDayEventCount=data.filter(entry => isDayEvent(entry.created_at)).length;
      const totalNightEventCount=data.filter(entry => !isDayEvent(entry.created_at)).length;
      const personDayCount = data.filter(entry => entry.species.some(species => species.id === "person" && isDayEvent(entry.created_at))).length;
      const personNightCount = data.filter(entry => entry.species.some(species => species.id === "person" && !isDayEvent(entry.created_at))).length;
      const animalDayCount = data.filter(entry => entry.species.some(species => species.id === "animal" && isDayEvent(entry.created_at))).length;
      const animalNightCount = data.filter(entry => entry.species.some(species => species.id === "animal" && !isDayEvent(entry.created_at))).length;
      const vehicleDayCount = data.filter(entry => entry.species.some(species => species.id === "vehicle" && isDayEvent(entry.created_at))).length;
      const vehicleNightCount = data.filter(entry => entry.species.some(species => species.id === "vehicle" && !isDayEvent(entry.created_at))).length;
      useEffect(() => {
        // Render the Venn diagram after the data is loaded
        if (data.length > 0) {
          // Structure your data for venn.js
          const vennData = [
              { sets: ['1'], size: totalEvent, label: 'Total Event' },
              { sets: ['2'], size: totalDayEventCount},
              { sets: ['3'], size: totalNightEventCount },
              {sets:['1','2'], size:totalDayEventCount,label:'Total Day Event'},
              {sets:['1','3'], size:totalNightEventCount,label:'Total Night Event'},
             ];
          
          const vennData1 = [
            { sets: ['1'], size: totalEvent, label: 'Total Event' },
            { sets: ['4'], size: personDayCount },
            { sets: ['5'], size: personNightCount},
            {sets:['1','4'],size:personDayCount,label: 'Person Day Event'},
            {sets:['1','5'],size:personNightCount,label: 'Person Night Event'},
           
        ];
        const vennData2 = [
          { sets: ['1'], size: totalEvent, label: 'Total Event' },
          { sets: ['6'], size: animalDayCount },
          { sets: ['7'], size: animalNightCount},
          {sets:['1','6'],size:animalDayCount,label :'Animal Day Event'},
          {sets:['1','7'],size:animalNightCount,label :'Animal Night Event'},
         
      ];
      const vennData3 = [
        { sets: ['1'], size: totalEvent, label: 'Total Event' },
        { sets: ['8'], size: vehicleDayCount },
        { sets: ['9'], size: vehicleNightCount },
        {sets:['1','8'],size:vehicleDayCount,label :'Vehicle Day Event'},
        {sets:['1','9'],size:vehicleNightCount,label :'Vehicle Night Event'},
       
    ];
          // Create the Venn diagram
          let chart = venn.VennDiagram();
          d3.select("#venn").datum(vennData).call(chart);
           // Adjust the height value as needed
         /*d3.select("#venn1").datum(vennData1).call(chart);
          d3.select("#venn2").datum(vennData2).call(chart);
          d3.select("#venn3").datum(vennData3).call(chart);*/
           // Select the container element and render the diagram
          //const vennContainer = document.getElementById('venn');
         // chart(vennContainer, vennData);
        }
      }, [data]);
    
 return (
    <div className="app" style={{display: 'flex', alignItems: 'center',justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap'}}>
   <h4>Events Distribution</h4>
    <div id="venn"></div>
   {/* 
   
    <div id="venn1"></div>
    <div id="venn2"></div>
 <div id="venn3"></div>*/}
  </div>
 );
}

export default VennDiagram;