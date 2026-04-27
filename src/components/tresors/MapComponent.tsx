"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
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

/**
 * Renders the Benin country shape using 3 separate Leaflet panes, 
 * each clipped with CSS to replicate the flag: 
 *   green left 40% / yellow top-right / red bottom-right
 */
function BeninFlagLayers({ geoJSON }: { geoJSON: any }) {
  const map = useMap();

  useEffect(() => {
    if (!geoJSON) return;

    // Create & clip panes
    const paneConfig: [string, string, string][] = [
      ["benin-green",  "#008751", "inset(0 60% 0 0)"],     // left 40%
      ["benin-yellow", "#FAC710", "inset(0 0 50% 40%)"],   // top-right
      ["benin-red",    "#E8112D", "inset(50% 0 0 40%)"],   // bottom-right
    ];

    const layers: L.GeoJSON[] = [];

    paneConfig.forEach(([name, color, clip], i) => {
      if (!map.getPane(name)) {
        map.createPane(name);
      }
      const pane = map.getPane(name)!;
      pane.style.clipPath = clip;
      pane.style.zIndex = String(200 + i);

      const isBase = i === 0;
      const layer = L.geoJSON(geoJSON, {
        pane: name,
        style: {
          fillColor: color,
          fillOpacity: 1,
          color: isBase ? "#008751" : "none",
          weight: isBase ? 1.5 : 0,
        },
      });
      layer.addTo(map);
      layers.push(layer);
    });

    return () => layers.forEach(l => l.remove());
  }, [map, geoJSON]);

  return null;
}

export default function MapComponent({ startPos, endPos, origine, exil }: MapComponentProps) {
  const [beninGeoJSON, setBeninGeoJSON] = useState<any>(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BEN.geo.json")
      .then(res => res.json())
      .then(data => setBeninGeoJSON(data))
      .catch(err => console.error("Error loading Benin GeoJSON:", err));
  }, []);

  const destText = exil.ville && exil.ville !== "Non renseignée" ? exil.ville : exil.pays;

  const originIcon = L.divIcon({
    className: "custom-combined-icon",
    html: `<div style="font-family:sans-serif;font-weight:800;font-size:11px;color:#1A1A1A;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;text-shadow:1px 1px 0 white,-1px -1px 0 white,1px -1px 0 white,-1px 1px 0 white;">BÉNIN</div>`,
    iconSize: undefined,
    iconAnchor: [0, -8],
  });

  const destIcon = L.divIcon({
    className: "custom-combined-icon",
    html: `<div style="display:flex;align-items:center;gap:8px;">
             <div style="background:#E0312D;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.3);flex-shrink:0;"></div>
             <div style="font-family:sans-serif;font-weight:800;font-size:11px;color:#1A1A1A;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;text-shadow:1px 1px 0 white,-1px -1px 0 white,1px -1px 0 white,-1px 1px 0 white;">${destText}</div>
           </div>`,
    iconSize: undefined,
    iconAnchor: [7, 7],
  });

  const bounds = L.latLngBounds([startPos, endPos]);

  return (
    <div className="flex flex-col h-full w-full relative">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        scrollWheelZoom={false}
        className="h-full w-full bg-[#F8F9FA]"
        attributionControl={false}
      >
        <ChangeView bounds={bounds} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

        <BeninFlagLayers geoJSON={beninGeoJSON} />

        <Marker position={startPos} icon={originIcon} interactive={false} />
        <Marker position={endPos} icon={destIcon}>
          <Popup>Exil : {exil.institution} ({exil.ville})</Popup>
        </Marker>

        <Polyline positions={[startPos, endPos]} color="#E8112D" weight={1.5} dashArray="8, 8" opacity={0.5} />
      </MapContainer>
    </div>
  );
}
