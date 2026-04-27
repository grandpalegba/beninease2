"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MapComponentProps {
  startPos: [number, number];
  endPos: [number, number];
  origine: { ville: string; pays: string };
  exil: { ville: string; pays: string; institution?: string };
}

export default function MapComponent({ startPos, endPos, origine, exil }: MapComponentProps) {
  const [beninGeoJSON, setBeninGeoJSON] = useState<any>(null);

  useEffect(() => {
    // Fetch Benin GeoJSON for background shape
    fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BEN.geo.json")
      .then(res => res.json())
      .then(data => setBeninGeoJSON(data))
      .catch(err => console.error("Error loading Benin GeoJSON:", err));
  }, []);

  // Custom icons
  const greenIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #2C9A5A; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  const redIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #E0312D; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

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
      {beninGeoJSON && (
        <GeoJSON 
          data={beninGeoJSON} 
          style={{
            color: "#2C9A5A",
            weight: 1,
            fillColor: "#2C9A5A",
            fillOpacity: 0.1,
            dashArray: "3, 3"
          }}
        />
      )}
      <Marker position={startPos} icon={greenIcon}>
        <Popup>Origine: {origine.ville}, {origine.pays}</Popup>
      </Marker>
      <Marker position={endPos} icon={redIcon}>
        <Popup>Exil: {exil.institution} ({exil.ville})</Popup>
      </Marker>
      <Polyline positions={[startPos, endPos]} color="#E8112D" weight={2} dashArray="10, 10" opacity={0.6} />
    </MapContainer>
  );
}
