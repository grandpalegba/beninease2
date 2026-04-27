"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MapComponentProps {
  startPos: [number, number];
  endPos: [number, number];
  origine: { ville: string; pays: string };
  exil: { ville: string; pays: string; institution?: string };
}

function ChangeView({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  return null;
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
    html: `<div style="font-family: sans-serif; font-weight: 900; font-size: 11px; color: #1A1A1A; text-transform: uppercase; letter-spacing: 0.15em; background: white; padding: 4px 8px; border-radius: 6px; white-space: nowrap; border: 1.5px solid #1A1A1A; box-shadow: 2px 2px 0px rgba(0,0,0,1);">${text}</div>`,
    iconSize: [0, 0],
    iconAnchor: [-10, 20], // Offset to not cover the marker
  });

  const bounds = L.latLngBounds([startPos, endPos]);

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* SVG Pattern Definition for Benin Flag */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <pattern id="beninFlagPattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
            <rect width="50%" height="100%" fill="#008751" /> {/* Green left half */}
            <rect x="50%" width="50%" height="50%" fill="#FAC710" /> {/* Yellow top right quarter */}
            <rect x="50%" y="50%" width="50%" height="50%" fill="#E8112D" /> {/* Red bottom right quarter */}
          </pattern>
        </defs>
      </svg>

      <MapContainer 
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        scrollWheelZoom={false} 
        className="h-full w-full bg-[#F8F9FA]"
        attributionControl={false}
      >
        <ChangeView bounds={bounds} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {beninGeoJSON && (
          <GeoJSON 
            data={beninGeoJSON} 
            style={{
              color: "#008751",
              weight: 1.5,
              fillOpacity: 0.9,
              fillColor: "url(#beninFlagPattern)" as any,
            }}
          />
        )}
        
        {/* Specific Country/City Labels */}
        <Marker position={startPos} icon={textIcon("Bénin")} interactive={false} />
        <Marker position={endPos} icon={textIcon(exil.ville && exil.ville !== "Non renseignée" ? exil.ville : exil.pays)} interactive={false} />

        {/* Exile Marker */}
        <Marker position={endPos} icon={redIcon}>
          <Popup>Exil: {exil.institution} ({exil.ville})</Popup>
        </Marker>
        
        <Polyline positions={[startPos, endPos]} color="#E8112D" weight={1.5} dashArray="8, 8" opacity={0.5} />
      </MapContainer>
    </div>
  );
}
