import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import {googleMapsApiKey} from "../../App";
const libraries = ['places'];

const mapContainerStyle = {
  height: "263px",
  width: "728px",
  borderRadius:'15px'
};

const center = { lat: 33.734457, lng: 73.045045 };

export const Maps = ({cameras}) => {
    console.log("Cameras:", cameras);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div id="map" style={{
            height: "300px", width: '100%', display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={5}
        center={center}
      >
          {cameras.map((cam, index) => (
          <Marker position={{ lat: cam.latitude, lng: cam.longitude }}
            title={cam.description}
            label={{
              text: String(cam.id),
              color: "black",
              fontSize: "7px"
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

