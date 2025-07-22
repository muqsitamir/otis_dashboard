import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from "axios";
import { backend_url } from '../../App';

const LiveChart = ({ cameraId, cameraName }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDayEvent = (updated_at) => {
    const eventDate = new Date(updated_at);
    const hour = eventDate.getHours();
    return hour >= 6 && hour < 18; // Assuming daytime is between 6 AM and 6 PM
  }

  // Read data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let result = [];
      const Header = { Authorization: `Token ${localStorage.getItem("token")}` };
      const config = { headers: Header };

      const getData = async (url) => {
        try {
          const response = await axios.get(url, config);
          result = result.concat(response.data.results);

          if (response.data.next) {
            await getData(response.data.next);
          } else {
            setData(result);
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setLoading(false);
        }
      };

      await getData(`${backend_url}/core/api/event/?cameras=${cameraId}`);
    };

    fetchData();
  }, [cameraId]);

  Highcharts.setOptions({
    time: {
      useUTC: false,
      timezone: 'Asia/Karachi',
    },
    chart: {
      style: {
        height: '300px'
      }
    }
  });

  const totalEvent = data.length;
  const totalNightEventCount = data.filter(entry => !isDayEvent(entry.created_at)).length;
  const totalDayEventCount = data.filter(entry => isDayEvent(entry.created_at)).length;

  const personDayCount = data.filter(entry => entry.species.some(species => species.id === "person" && isDayEvent(entry.created_at))).length;
  const animalDayCount = data.filter(entry => entry.species.some(species => species.id === "animal" && isDayEvent(entry.created_at))).length;
  const vehicleDayCount = data.filter(entry => entry.species.some(species => species.id === "vehicle" && isDayEvent(entry.created_at))).length;
  const personNightCount = data.filter(entry => entry.species.some(species => species.id === "person" && !isDayEvent(entry.created_at))).length;
  const animalNightCount = data.filter(entry => entry.species.some(species => species.id === "animal" && !isDayEvent(entry.created_at))).length;
  const vehicleNightCount = data.filter(entry => entry.species.some(species => species.id === "vehicle" && !isDayEvent(entry.created_at))).length;

  // Function to get unique species combinations for each event
  const getSpeciesCombinations = (event) => {
    return event.species.map((species) => species.id);
  };

  // Count occurrences for each event with more than one species
  const countMultipleSpeciesEvents = (events, isDayEvent) => {
    return events.filter((entry) => {
      if (isDayEvent(entry.created_at)) {
        const species = getSpeciesCombinations(entry);
        return species.length > 1; // More than one species
      }
      return false;
    }).length;
  };

  const dayMultipleSpeciesCount = countMultipleSpeciesEvents(data, isDayEvent);
  const nightMultipleSpeciesCount = countMultipleSpeciesEvents(data, (updated_at) => !isDayEvent(updated_at));

  const totalNightCount = animalNightCount + vehicleNightCount + personNightCount;
  const totalDayCount = animalDayCount + vehicleDayCount + personDayCount;

  const optionsDay = {
    chart: { type: 'pie' },
    title: { text: `Total Day Events ${totalDayEventCount}` },
    plotOptions: { pie: { size: '75%' } },
    series: [
      {
        name: 'Event Types',
        data: [
          { name: 'Person', y: personDayCount },
          { name: 'Animal', y: animalDayCount },
          { name: 'Vehicle', y: vehicleDayCount },
        ],
      },
    ],
  };

  const optionsNight = {
    chart: { type: 'pie' },
    title: { text: `Total Night Events ${totalNightEventCount}` },
    plotOptions: { pie: { size: '75%' } },
    series: [
      {
        name: 'Event Types',
        data: [
          { name: 'Person', y: personNightCount },
          { name: 'Animal', y: animalNightCount },
          { name: 'Vehicle', y: vehicleNightCount },
        ],
      },
    ],
  };

  // Render multiple species event counts
  const renderMultipleSpeciesCount = (totalMultipleSpeciesCount) => (
    <p style={{ color: 'black', fontWeight: '500' }}>
      Events with more than one species: {totalMultipleSpeciesCount}
    </p>
  );

  if (loading) {
    return <div>Loading...</div>; // Display a loading bar or indicator here
  }

  return (
    <>
      <h3>Total Event {totalEvent}</h3>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: '300px' }}>
        <HighchartsReact highcharts={Highcharts} options={optionsDay} />
        <HighchartsReact highcharts={Highcharts} options={optionsNight} />
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderMultipleSpeciesCount(dayMultipleSpeciesCount)}
        </div>
        <div>
          {renderMultipleSpeciesCount(nightMultipleSpeciesCount)}
        </div>
      </div>
    </>
  );
};

export default LiveChart;
