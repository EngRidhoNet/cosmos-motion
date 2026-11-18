import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

const INK = "#0a0908";

export function lonLatToStitchedPixel(
  lon: number,
  lat: number,
  centerLon: number,
  centerLat: number,
  zoom: number,
  gridRadius = 2,
): [number, number] {
  const n = Math.pow(2, zoom);
  const toTileXY = (ln: number, lt: number) => {
    const x = ((ln + 180) / 360) * n;
    const rad = (lt * Math.PI) / 180;
    const y =
      ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
    return [x, y];
  };
  const [cx, cy] = toTileXY(centerLon, centerLat);
  const topLeftTileX = Math.floor(cx) - gridRadius;
  const topLeftTileY = Math.floor(cy) - gridRadius;
  const [px, py] = toTileXY(lon, lat);
  return [(px - topLeftTileX) * 256, (py - topLeftTileY) * 256];
}

export interface MapMarker {
  label: string;
  lon: number;
  lat: number;
  color?: string;
  pulse?: boolean;
}

export const SlippyTileMap: React.FC<{
  osmTileImage: string;
  satTileImage?: string;
  centerLon: number;
  centerLat: number;
  zoom: number;
  gridRadius?: number;
  width?: number;
  height?: number;
  markers?: MapMarker[];
  borderColor?: string;
}> = ({
  osmTileImage,
  satTileImage,
  centerLon,
  centerLat,
  zoom,
  gridRadius = 2,
  width = 992,
  height = 830,
  markers = [],
  borderColor = "#FFD60A",
}) => {
  const frame = useCurrentFrame();
  const satBlend = interpolate(frame, [15, 70], [0.25, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tileSidePx = (gridRadius * 2 + 1) * 256;
  const scaleX = width / tileSidePx;
  const scaleY = height / tileSidePx;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 14,
        overflow: "hidden",
        border: `4px solid ${borderColor}`,
        backgroundColor: "#0b1118",
      }}
    >
      <img
        src={osmTileImage}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.58) contrast(1.2) saturate(0.7)",
        }}
      />
      {satTileImage && (
        <img
          src={satTileImage}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: satBlend,
            mixBlendMode: "multiply",
          }}
        />
      )}

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "relative", zIndex: 5 }}
      >
        {markers.map((m, idx) => {
          const [rawX, rawY] = lonLatToStitchedPixel(
            m.lon,
            m.lat,
            centerLon,
            centerLat,
            zoom,
            gridRadius,
          );
          const x = rawX * scaleX;
          const y = rawY * scaleY;
          const col = m.color || "#FFD60A";
          const radarR = 20 + ((frame * 1.5 + idx * 12) % 45);
          return (
            <g key={idx} transform={`translate(${x}, ${y})`}>
              {m.pulse && (
                <circle
                  cx="0"
                  cy="0"
                  r={radarR}
                  fill="none"
                  stroke="#ff4d5e"
                  strokeWidth="3.5"
                />
              )}
              <circle cx="0" cy="0" r="10" fill={col} stroke={INK} strokeWidth="3.5" />
              <rect
                x="-120"
                y="-44"
                width="240"
                height="28"
                rx="6"
                fill="rgba(10, 14, 22, 0.92)"
                stroke={col}
                strokeWidth="2.5"
              />
              <text x="0" y="-25" textAnchor="middle" fill={col} fontSize="14" fontWeight="900">
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
