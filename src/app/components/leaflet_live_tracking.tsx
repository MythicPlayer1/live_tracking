/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

'use client';

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import dynamic from 'next/dynamic';
import { postLocation } from "../apis/apis";
// import './node_modules/leaflet-geosearch/assets/css/leaflet.css';
// import '.../node_modules/leaflet-geosearch/assets/css/leaflet.css';

const RoutingControl = dynamic(() => import('../components/mapRouting'), { ssr: false });


// Custom marker icon
const userIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface Coords {
  lat: number;
  lng: number;
}

export interface User {
  name: string;
  location: { latitude: number; longitude: number };
}

export interface LeafletgeoSearchProps {
    setCoords: (coords: [number, number]) => void;
}
const LeafletLiveTracking: React.FC = () => {
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const [users] = useState<User[]>([]);
//   const [startCoords, setStartCoords] = useState<Coords | null>(null);
  const [endCoords, setEndCoords] = useState<Coords | null>(null);
  const [routingKey, setRoutingKey] = useState(0);


  const takeEndCoords = (coords: [number, number]) => {
    setEndCoords(coords);
    setRoutingKey(prevKey => prevKey + 1);
  }

  // Track user location and send updates to WebSocket
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        postLocation({
          name: "user123",
          latitude:latitude,
          longitude:longitude

        }).then((resp)=>{
          console.log(resp);
        });
      }, // Retry after 5 seconds
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Receive real-time location updates

  return (
    <MapContainer center={[27.7172, 85.3240]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer minZoom={1} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {userCoords && <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon} />}
      {users.map((user) => (
        <Marker key={user.name} position={[user.location.latitude, user.location.longitude]} icon={userIcon} />
      ))}
      {userCoords !== null && endCoords !== null && <RoutingControl
        position={'topleft'}
        start={[userCoords?.lat, userCoords?.lng]}
        // start={startCoords}
        end={endCoords}
        color={'green'}
        key={routingKey}
        
      />}


      <LeafletDestinationgeoSearch setCoords={takeEndCoords} />
    </MapContainer>
  );
};

export default LeafletLiveTracking;


const LeafletDestinationgeoSearch: React.FC<LeafletgeoSearchProps> = ({ setCoords }) => {
  const map = useMapEvents({});

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl1 = new GeoSearchControl({
      provider,
      marker: {
        icon: new L.Icon({
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      }
    });

    map.addControl(searchControl1);

    map.on('geosearch/showlocation', (result) => {
      const { y, x } = result.location;
      setCoords([y, x]);
    });

    return () => {
      map.removeControl(searchControl1);
    };
  }, [map]);

  return null;
};


