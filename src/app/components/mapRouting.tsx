/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
 
// "use client";

// import L from "leaflet";
// import { createControlComponent } from "@react-leaflet/core";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";


// const createRoutineMachineLayer = ({ position, start, end, color }) => {
//   const instance = L.Routing.control({
//     position,
//     waypoints: [
//       start,
//       end
//     ],
//     lineOptions: {
//       styles: [
//         {
//           color,
//           opacity: 0.8,
//           weight: 6,
//         },
//       ],
//     },
//     showAlternatives: true,
//     waypointMode: "snap",
//     routeWhileDragging: true,
//     autoRoute: true,
//   });


// console.log("instance", instance);
//   return instance;
// };
// const RoutingMachine = createControlComponent(createRoutineMachineLayer);
// export default RoutingMachine;


import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import { forwardRef, useImperativeHandle } from "react";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const createRoutineMachineLayer = ({ position, start, end, color }) => {
  const instance = L.Routing.control({
    position,
    waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
    lineOptions: {
      styles: [{ color, opacity: 0.8, weight: 6 }],
    },
    showAlternatives: false,
    waypointMode: "snap",
    routeWhileDragging: true,
    autoRoute: true,
  });

  return instance;
};

// ✅ Correctly create the control component
const RoutingMachine = forwardRef(({ position, start, end, color }, ref) => {
  const RoutingInstance = createControlComponent(() =>
    createRoutineMachineLayer({ position, start, end, color })
  );

  // ✅ Expose the `setWaypoints` method for dynamic updates
  useImperativeHandle(ref, () => ({
    setWaypoints: (newStart, newEnd) => {
      if (RoutingInstance) {
        RoutingInstance.instance.setWaypoints([
          L.latLng(newStart[0], newStart[1]),
          L.latLng(newEnd[0], newEnd[1]),
        ]);
      }
    },
  }));

  return <RoutingInstance />;
});

RoutingMachine.displayName = "RoutingMachine";

export default RoutingMachine;



