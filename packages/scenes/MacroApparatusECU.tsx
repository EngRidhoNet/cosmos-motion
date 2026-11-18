import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CaptionStamp, CinemaCam, FilmLook, SourceBadge } from "@cosmos-motion/core";

export interface MacroSpecimenItem {
  title: string;
  taxon: string;
  detail: string;
  photoSrc: string;
  accent?: string;
  code?: string;
}

export const MacroApparatusECU: React.FC<{
  title: string;
  subtitle?: string;
  items: MacroSpecimenItem[];
  citation: string;
  durationInFrames?: number;
}> = ({ title, subtitle, items, citation, durationInFrames = 140 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f16", overflow: "hidden" }}>
      <CaptionStamp title={title} subtitle={subtitle} />
      <SourceBadge category="SUMBER ILMIAH" source={citation} />

      <CinemaCam durationInFrames={durationInFrames} move="dollyIn" zoomFrom={1.0} zoomTo={1.06}>
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 320,
            width: 968,
            height: 980,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {items.slice(0, 4).map((item, idx) => {
            const appear = interpolate(frame, [idx * 10, idx * 10 + 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const col = item.accent || "#FFD60A";
            return (
              <div
                key={idx}
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `4px solid ${col}`,
                  backgroundColor: "#141a22",
                  boxShadow: "0 20px 44px rgba(0,0,0,0.85)",
                  opacity: appear,
                  transform: `translateY(${(1 - appear) * 24}px)`,
                }}
              >
                <img
                  src={item.photoSrc}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(8,11,18,0.45) 0%, rgba(8,11,18,0.12) 45%, rgba(8,11,18,0.92) 100%)",
                  }}
                />
                {item.code && (
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      backgroundColor: "rgba(10,9,8,0.88)",
                      border: `2px solid ${col}`,
                      padding: "4px 10px",
                      borderRadius: 6,
                      color: col,
                      fontSize: 13,
                      fontWeight: 900,
                      fontFamily: "monospace",
                    }}
                  >
                    {item.code}
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 16, left: 18, right: 18 }}>
                  <div style={{ color: col, fontSize: 23, fontWeight: 900, fontFamily: "serif" }}>
                    {item.title}
                  </div>
                  <div style={{ color: "#ffffff", fontSize: 15, fontWeight: 700, fontStyle: "italic", marginTop: 2 }}>
                    {item.taxon}
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600, marginTop: 3 }}>
                    {item.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CinemaCam>
      <FilmLook warmth={0.16} vignette={0.54} />
    </AbsoluteFill>
  );
};
