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

  // Text Icons
  const textIcon = (text: string) => L.divIcon({
    className: "custom-text-icon",
    html: `<div style="font-family: sans-serif; font-weight: 800; font-size: 10px; color: #1A1A1A; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(255,255,255,0.8); padding: 2px 6px; border-radius: 4px; white-space: nowrap; border: 1px solid rgba(0,0,0,0.05);">${text}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  return (
    <div className="flex flex-col h-full w-full relative">
      <MapContainer 
        center={[25, 10]} 
        zoom={2} 
        scrollWheelZoom={false} 
        className="h-full w-full bg-[#F8F9FA]"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {beninGeoJSON && (
          <GeoJSON 
            data={beninGeoJSON} 
            style={{
              color: "#008751",
              weight: 2,
              fillOpacity: 0.8,
              fillColor: "#008751",
            }}
          />
        )}
        
        {/* Specific Country Labels */}
        <Marker position={startPos} icon={textIcon("Bénin")} interactive={false} />
        <Marker position={endPos} icon={textIcon(exil.pays)} interactive={false} />

        {/* Exile Marker */}
        <Marker position={endPos} icon={redIcon}>
          <Popup>Exil: {exil.institution} ({exil.ville})</Popup>
        </Marker>
        
        <Polyline positions={[startPos, endPos]} color="#E8112D" weight={1.5} dashArray="8, 8" opacity={0.5} />
      </MapContainer>
    </div>
  );
}
