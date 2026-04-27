"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapComponentProps {
  startPos: [number, number];
  endPos: [number, number];
  origine: { ville: string; pays: string };
  exil: { ville: string; pays: string; institution?: string };
}

export default function MapComponent({ startPos, endPos, origine, exil }: MapComponentProps) {
  useEffect(() => {
    // Fix for default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer 
      center={[25, 5]} 
      zoom={2} 
      scrollWheelZoom={false} 
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={startPos}>
        <Popup>Origine: {origine.ville}, {origine.pays}</Popup>
      </Marker>
      <Marker position={endPos}>
        <Popup>Exil: {exil.institution} ({exil.ville})</Popup>
      </Marker>
      <Polyline positions={[startPos, endPos]} color="#E8112D" weight={3} dashArray="10, 10" />
    </MapContainer>
  );
}
