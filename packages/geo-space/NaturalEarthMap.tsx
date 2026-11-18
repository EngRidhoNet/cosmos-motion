import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
  geoPath,
  geoGraticule,
} from "d3-geo";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json";

const INK = "#0a0908";

export interface GeoHub {
  name: string;
  coords: [number, number]; // [lon, lat]
  color?: string;
  subtitle?: string;
}

export const NaturalEarthMap: React.FC<{
  width?: number;
  height?: number;
  projectionType?: "naturalEarth1" | "orthographic" | "mercator";
  originCoords?: [number, number];
  hubs: GeoHub[];
  routeColor?: string;
}> = ({
  width = 992,
  height = 650,
  projectionType = "naturalEarth1",
  originCoords,
  hubs,
  routeColor = "#FFD60A",
}) => {
  const frame = useCurrentFrame();

  const { countries, graticulePath, projection, arcs } = useMemo(() => {
    const baseProj =
      projectionType === "orthographic"
        ? geoOrthographic()
        : projectionType === "mercator"
          ? geoMercator()
          : geoNaturalEarth1();

    const proj = baseProj.fitExtent(
      [
        [18, 18],
        [width - 18, height - 18],
      ],
      { type: "Sphere" } as any,
    );
    const pathGen = geoPath(proj);
    const topo: any = worldAtlas;
    const geoCountries: any = feature(topo, topo.objects.countries);
    const grat = pathGen(geoGraticule()());
    const startPt = originCoords || (hubs[0]?.coords ?? [0, 0]);

    const arcPaths = hubs.slice(originCoords ? 0 : 1).map((hub) => ({
      hub,
      d:
        pathGen({
          type: "LineString",
          coordinates: [startPt, hub.coords],
        } as any) || "",
    }));

    return {
      countries: geoCountries.features.map((f: any, idx: number) => ({
        key: f.id || idx,
        d: pathGen(f) || "",
      })),
      graticulePath: grat || "",
      projection: proj,
      arcs: arcPaths,
    };
  }, [width, height, projectionType, originCoords, hubs]);

  const routeDash = interpolate(frame, [0, 85], [900, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="0" y="0" width={width} height={height} rx="14" fill="#0d1b2a" />
      <path
        d={graticulePath}
        fill="none"
        stroke="rgba(125, 211, 252, 0.14)"
        strokeWidth="1"
      />
      <g>
        {countries.map((c: any) => (
          <path
            key={c.key}
            d={c.d}
            fill="#25382e"
            stroke="#456152"
            strokeWidth="0.8"
          />
        ))}
      </g>
      <g
        fill="none"
        stroke={routeColor}
        strokeWidth="3.2"
        strokeDasharray="900"
        strokeDashoffset={routeDash}
      >
        {arcs.map((a, i) => (
          <path key={i} d={a.d} opacity="0.92" />
        ))}
      </g>
      {hubs.map((h, i) => {
        const pt = projection(h.coords);
        if (!pt || frame < i * 9) return null;
        const col = h.color || "#FFD60A";
        const pingR = 8 + ((frame * 1.1 + i * 7) % 20);
        return (
          <g key={i} transform={`translate(${pt[0]}, ${pt[1]})`}>
            <circle
              cx="0"
              cy="0"
              r={pingR}
              fill="none"
              stroke={col}
              strokeWidth="2.5"
              opacity="0.65"
            />
            <circle cx="0" cy="0" r="6.5" fill={col} stroke={INK} strokeWidth="2.5" />
            <rect
              x="-82"
              y="10"
              width="164"
              height="22"
              rx="4"
              fill="rgba(10, 14, 20, 0.9)"
            />
            <text x="0" y="25" textAnchor="middle" fill={col} fontSize="11.5" fontWeight="800">
              {h.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
