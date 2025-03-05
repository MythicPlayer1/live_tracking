/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-nocheck

"use client";

import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const createRoutineMachineLayer = ({ position, start, end, color }) => {
  const instance = L.Routing.control({
    position,
    waypoints: [
      start,
      end
    ],
    lineOptions: {
      styles: [
        {
          color,
          opacity: 0.8,
          weight: 6,
        },
      ],
    },
    showAlternatives: true,
    waypointMode: "connect",
    routeWhileDragging: true,
  });

console.log("instance", instance);
  return instance;
};
const RoutingMachine = createControlComponent(createRoutineMachineLayer);
export default RoutingMachine;

