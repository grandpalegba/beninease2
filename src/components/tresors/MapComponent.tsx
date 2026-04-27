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
    const t = setTimeout(() => map.zoomIn(1), 100);
    return () => clearTimeout(t);
  }, [map, bounds]);
  return null;
}

/** Canvas overlay — draws Benin flag colors clipped to the real GeoJSON path */
function BeninFlagCanvas({ geoJSON }: { geoJSON: any }) {
  const map = useMap();

  useEffect(() => {
    if (!geoJSON) return;

    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "absolute", left: "0", top: "0",
      width: "100%", height: "100%", pointerEvents: "none", zIndex: "500",
    });
    map.getContainer().appendChild(canvas);

    const draw = () => {
      const { x: w, y: h } = map.getSize();
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      const sw = map.latLngToContainerPoint(L.latLng(6.2, 0.77));
      const ne = map.latLngToContainerPoint(L.latLng(12.4, 3.85));
      const minX = Math.min(sw.x, ne.x), maxX = Math.max(sw.x, ne.x);
      const minY = Math.min(sw.y, ne.y), maxY = Math.max(sw.y, ne.y);
      const splitX = minX + (maxX - minX) * 0.4;
      const splitY = minY + (maxY - minY) * 0.5;

      const buildPath = (polys: number[][][][]) => {
        const p = new Path2D();
        polys.forEach(poly =>
          poly.forEach(ring =>
            ring.forEach(([lng, lat], i) => {
              const { x, y } = map.latLngToContainerPoint(L.latLng(lat, lng));
              i === 0 ? p.moveTo(x, y) : p.lineTo(x, y);
            })
          )
        );
        return p;
      };

      const features = geoJSON.type === "FeatureCollection" ? geoJSON.features : [geoJSON];
      features.forEach((feat: any) => {
        const geom = feat.geometry || feat;
        const polys: number[][][][] = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
        const path = buildPath(polys);

        const sections: [string, number, number, number, number][] = [
          ["#008751", 0,      0,      splitX,     h          ],
          ["#FAC710", splitX, 0,      w - splitX, splitY     ],
          ["#E8112D", splitX, splitY, w - splitX, h - splitY ],
        ];

        sections.forEach(([fill, rx, ry, rw, rh]) => {
          ctx.save();
          ctx.clip(path);
          ctx.fillStyle = fill;
          ctx.fillRect(rx, ry, rw, rh);
          ctx.restore();
        });

        ctx.save();
        ctx.strokeStyle = "#008751"; ctx.lineWidth = 1.5;
        ctx.stroke(path);
        ctx.restore();
      });
    };

    draw();
    map.on("viewreset zoom move drag zoomend moveend", draw);
    return () => {
      map.off("viewreset zoom move drag zoomend moveend", draw);
      canvas.parentNode?.removeChild(canvas);
    };
  }, [map, geoJSON]);

  return null;
}

export default function MapComponent({ startPos, endPos, origine, exil }: MapComponentProps) {
  const [beninGeoJSON, setBeninGeoJSON] = useState<any>(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BEN.geo.json")
      .then(r => r.json()).then(setBeninGeoJSON).catch(console.error);
  }, []);

  const destText = exil.ville && exil.ville !== "Non renseignée" ? exil.ville : exil.pays;

  const originIcon = L.divIcon({
    className: "custom-combined-icon",
    html: `<div style="font-family:sans-serif;font-weight:800;font-size:11px;color:#1A1A1A;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;text-shadow:1px 1px 0 white,-1px -1px 0 white,1px -1px 0 white,-1px 1px 0 white;">BÉNIN</div>`,
    iconSize: undefined,
    iconAnchor: [-18, 5], // Offset right: label appears to the right of Benin shape
  });

  const destIcon = L.divIcon({
    className: "custom-combined-icon",
    html: `<div style="display:flex;align-items:center;gap:8px;"><div style="background:#E0312D;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.3);flex-shrink:0;"></div><div style="font-family:sans-serif;font-weight:800;font-size:11px;color:#1A1A1A;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;text-shadow:1px 1px 0 white,-1px -1px 0 white,1px -1px 0 white,-1px 1px 0 white;">${destText}</div></div>`,
    iconSize: undefined, iconAnchor: [7, 7],
  });

  const bounds = L.latLngBounds([startPos, endPos]);

  return (
    <div className="flex flex-col h-full w-full relative">
      <MapContainer bounds={bounds} boundsOptions={{ padding: [50, 50] }} scrollWheelZoom={false} zoomControl={false} className="h-full w-full bg-[#F8F9FA]" attributionControl={false}>
        <ChangeView bounds={bounds} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
        <BeninFlagCanvas geoJSON={beninGeoJSON} />
        <Marker position={startPos} icon={originIcon} interactive={false} />
        <Marker position={endPos} icon={destIcon}>
          <Popup>Exil : {exil.institution} ({exil.ville})</Popup>
        </Marker>
        <Polyline positions={[startPos, endPos]} color="#E8112D" weight={1.5} dashArray="8, 8" opacity={0.5} />
      </MapContainer>
    </div>
  );
}
