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

/** Injects the Benin flag pattern into Leaflet's own SVG renderer so that
 *  fillColor: "url(#beninFlag)" works on GeoJSON paths. */
function BeninFlagDefs() {
  const map = useMap();

  useEffect(() => {
    const inject = () => {
      // Leaflet SVG renderer container
      const renderer = (map as any)._renderer;
      const svg: SVGElement | null = renderer?._container ?? null;
      if (!svg) return;

      // Ensure <defs> exists
      let defs = svg.querySelector("defs");
      if (!defs) {
        defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svg.insertBefore(defs, svg.firstChild);
      }

      // Only inject once
      if (svg.querySelector("#beninFlag")) return;

      const ns = "http://www.w3.org/2000/svg";
      const pattern = document.createElementNS(ns, "pattern");
      pattern.id = "beninFlag";
      pattern.setAttribute("patternUnits", "objectBoundingBox");
      pattern.setAttribute("width", "1");
      pattern.setAttribute("height", "1");

      const makeRect = (x: string, y: string, w: string, h: string, fill: string) => {
        const r = document.createElementNS(ns, "rect");
        r.setAttribute("x", x); r.setAttribute("y", y);
        r.setAttribute("width", w); r.setAttribute("height", h);
        r.setAttribute("fill", fill);
        return r;
      };

      // Green left half
      pattern.appendChild(makeRect("0",    "0",   "0.42", "1",   "#008751"));
      // Yellow top-right
      pattern.appendChild(makeRect("0.42", "0",   "0.58", "0.5", "#FAC710"));
      // Red bottom-right
      pattern.appendChild(makeRect("0.42", "0.5", "0.58", "0.5", "#E8112D"));

      defs.appendChild(pattern);
    };

    inject();
    // Retry after Leaflet finishes rendering
    const t = setTimeout(inject, 300);
    return () => clearTimeout(t);
  }, [map]);

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

  // Combined Icons (Dot + Text)
  const destText = exil.ville && exil.ville !== "Non renseignée" ? exil.ville : exil.pays;

  const originIcon = L.divIcon({
    className: "custom-combined-icon",
    html: `<div style="font-family: sans-serif; font-weight: 800; font-size: 11px; color: #1A1A1A; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; text-shadow: 1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white;">BÉNIN</div>`,
    iconSize: undefined,
    iconAnchor: [0, -8],
  });

  const destIcon = L.divIcon({
    className: "custom-combined-icon",
    html: `<div style="display: flex; align-items: center; gap: 8px;">
             <div style="background-color: #E0312D; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3); flex-shrink: 0;"></div>
             <div style="font-family: sans-serif; font-weight: 800; font-size: 11px; color: #1A1A1A; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; text-shadow: 1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white;">${destText}</div>
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
        <BeninFlagDefs />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

        {beninGeoJSON && (
          <GeoJSON
            data={beninGeoJSON}
            style={{
              color: "#008751",
              weight: 1.5,
              fillOpacity: 1,
              fillColor: "url(#beninFlag)" as any,
            }}
          />
        )}

        <Marker position={startPos} icon={originIcon} interactive={false} />
        <Marker position={endPos} icon={destIcon}>
          <Popup>Exil : {exil.institution} ({exil.ville})</Popup>
        </Marker>

        <Polyline positions={[startPos, endPos]} color="#E8112D" weight={1.5} dashArray="8, 8" opacity={0.5} />
      </MapContainer>
    </div>
  );
}
