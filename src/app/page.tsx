"use client";

import dynamic from 'next/dynamic';

// Dynamically import LeafletLiveTracking
const LeafletLiveTracking = dynamic(() => import('./components/leaflet_live_tracking'), { ssr: false });

export default function Home() {
  return (
    <>
      <LeafletLiveTracking />
    </>
  );
}