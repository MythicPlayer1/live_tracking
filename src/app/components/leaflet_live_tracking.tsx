/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

"use client"; // Ensures the file runs only on the client side

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import dynamic from "next/dynamic";
import { postLocation } from "../apis/apis";

const RoutingControl = dynamic(() => import("../components/mapRouting"), { ssr: false });

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
  const [endCoords, setEndCoords] = useState<Coords | null>(null);
  const [, setRoutingKey] = useState(0);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  const takeEndCoords = (coords: [number, number]) => {
    setEndCoords({ lat: coords[0], lng: coords[1] });
    setRoutingKey((prevKey) => prevKey + 1);
  };

  // Track user location and send updates to WebSocket
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });

          postLocation({
            name: "user123",
            latitude,
            longitude,
          }).then((resp) => {
            console.log(resp);
          });
          if (routingControlRef.current) {
            routingControlRef.current.setWaypoints([
              L.latLng(latitude, longitude),
              L.latLng(endCoords?.lat || latitude, endCoords?.lng || longitude),
            ]);
          }
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    if (userCoords !== null && endCoords !== null) {
      setRoutingKey((prevKey) => prevKey + 1);
    }
  }, [userCoords, endCoords]);



  return (
    <MapContainer center={[27.7172, 85.324]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer minZoom={1} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {userCoords && <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon} />}
      {users.map((user) => (
        <Marker key={user.name} position={[user.location.latitude, user.location.longitude]} icon={userIcon} />
      ))}
      {userCoords !== null && endCoords !== null && (
        <RoutingControl 
        position={"topleft"} 
        start={[userCoords.lat, userCoords.lng]} 
        end={[endCoords.lat, endCoords.lng]} 
        color={"green"} 
        ref={routingControlRef}
         />
      )}

      <LeafletDestinationgeoSearch setCoords={takeEndCoords} />
    </MapContainer>
  );
};

export default LeafletLiveTracking;

const LeafletDestinationgeoSearch: React.FC<LeafletgeoSearchProps> = ({ setCoords }) => {
    const map = useMapEvents({});
  useEffect(() => {
    if (typeof window !== "undefined") {

      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        marker: {
          icon: new L.Icon({
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          }),
        },
      });

      map.addControl(searchControl);

      map.on("geosearch/showlocation", (result) => {
        const { y, x } = result.location;
        setCoords([y, x]);
      });

      return () => {
        map.removeControl(searchControl);
      };
    }
  }, []);

  return null;
};

