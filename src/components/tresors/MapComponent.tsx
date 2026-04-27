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

  // Combined Icons (Dot + Text)
  const destText = exil.ville && exil.ville !== "Non renseignée" ? exil.ville : exil.pays;
  
  // Origin: text only (country shape already shows the flag colors)
  const originIcon = L.divIcon({
    className: "custom-combined-icon",
    html: `<div style="font-family: sans-serif; font-weight: 800; font-size: 11px; color: #1A1A1A; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; text-shadow: 1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white;">BÉNIN</div>`,
    iconSize: undefined,
    iconAnchor: [0, -8], // Slightly above the origin point
  });

  const destIcon = L.divIcon({
    className: "custom-combined-icon",
    html: `<div style="display: flex; align-items: center; gap: 8px;">
             <div style="background-color: #E0312D; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3); flex-shrink: 0;"></div>
             <div style="font-family: sans-serif; font-weight: 800; font-size: 11px; color: #1A1A1A; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; text-shadow: 1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white;">${destText}</div>
           </div>`,
    iconSize: undefined,
    iconAnchor: [7, 7], // Anchor on the dot center
  });

  const bounds = L.latLngBounds([startPos, endPos]);

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* SVG Pattern Definition for Benin Flag (objectBoundingBox ensures it fits the shape) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <pattern id="beninFlagPattern" patternUnits="objectBoundingBox" width="1" height="1">
            <rect width="0.45" height="1" fill="#008751" /> {/* Green left */}
            <rect x="0.45" width="0.55" height="0.5" fill="#FAC710" /> {/* Yellow top right */}
            <rect x="0.45" y="0.5" width="0.55" height="0.5" fill="#E8112D" /> {/* Red bottom right */}
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
              fillOpacity: 1,
              fillColor: "url(#beninFlagPattern)" as any,
            }}
          />
        )}
        
        {/* Markers */}
        <Marker position={startPos} icon={originIcon} interactive={false} />
        <Marker position={endPos} icon={destIcon}>
          <Popup>Exil: {exil.institution} ({exil.ville})</Popup>
        </Marker>
        
        <Polyline positions={[startPos, endPos]} color="#E8112D" weight={1.5} dashArray="8, 8" opacity={0.5} />
      </MapContainer>
    </div>
  );
}
