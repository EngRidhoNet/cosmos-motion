import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CaptionStamp, CinemaCam, FilmLook, SourceBadge } from "@cosmos-motion/core";

export const DataTimelineShot: React.FC<{
  title: string;
  subtitle?: string;
  metricLabel: string;
  startValue: number;
  endValue: number;
  unit?: string;
  description: string;
  citation: string;
  durationInFrames?: number;
  accent?: string;
}> = ({
  title,
  subtitle,
  metricLabel,
  startValue,
  endValue,
  unit = "",
  description,
  citation,
  durationInFrames = 120,
  accent = "#FFD60A",
}) => {
  const frame = useCurrentFrame();
  const val = Math.round(
    interpolate(frame, [0, Math.max(20, durationInFrames - 25)], [startValue, endValue], {
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#080e18", overflow: "hidden" }}>
      <CaptionStamp title={title} subtitle={subtitle} accent={accent} />
      <SourceBadge category="SUMBER ILMIAH" source={citation} />

      <CinemaCam durationInFrames={durationInFrames} move="dollyIn" zoomFrom={1.0} zoomTo={1.06}>
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 460,
            width: 968,
            padding: "56px 40px",
            borderRadius: 18,
            backgroundColor: "rgba(10, 17, 29, 0.94)",
            border: `4px solid ${accent}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
            textAlign: "center",
          }}
        >
          <div style={{ color: "#90e0ef", fontSize: 22, fontWeight: 800, letterSpacing: 2.5 }}>
            {metricLabel}
          </div>
          <div
            style={{
              color: accent,
              fontSize: 96,
              fontWeight: 900,
              fontFamily: "serif",
              marginTop: 18,
              lineHeight: 1.05,
            }}
          >
            {val.toLocaleString("id-ID")}
            {unit}
          </div>
          <div style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 700, marginTop: 22 }}>
            {description}
          </div>
        </div>
      </CinemaCam>
      <FilmLook warmth={0.1} vignette={0.55} />
    </AbsoluteFill>
  );
};
