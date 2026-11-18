import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily: jakarta } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

export const SmoothShotWrapper: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [Math.max(9, durationInFrames - 8), durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rawOpacity = Math.min(fadeIn, fadeOut);
  const opacity = rawOpacity * rawOpacity * (3 - 2 * rawOpacity);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ zIndex: 25 }}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 95px rgba(0, 0, 0, 0.58)",
          border: "12px solid #0a0908",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </AbsoluteFill>
  );
};

export const DocumentaryChrome: React.FC<{
  actLabel: string;
  seriesTitle: string;
  progressPct: number;
}> = ({ actLabel, seriesTitle, progressPct }) => (
  <>
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 56,
        right: 56,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: `${jakarta}, sans-serif`,
        zIndex: 55,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(10, 13, 24, 0.9)",
          border: "3px solid #0a0908",
          boxShadow: "4px 4px 0px #0a0908",
          padding: "8px 16px",
          borderRadius: 6,
          color: "#FFD60A",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        {actLabel}
      </div>
      <div
        style={{
          backgroundColor: "rgba(10, 13, 24, 0.9)",
          border: "3px solid #0a0908",
          padding: "8px 14px",
          borderRadius: 6,
          color: "#e0f2fe",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        {seriesTitle}
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${progressPct}%`,
        height: 6,
        backgroundColor: "#FFD60A",
        boxShadow: "0 0 12px rgba(255, 214, 10, 0.85)",
        zIndex: 60,
        pointerEvents: "none",
      }}
    />

    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 18%, transparent 62%, rgba(0,0,0,0.72) 100%)",
        pointerEvents: "none",
        zIndex: 32,
      }}
    />
  </>
);

export const CaptionStamp: React.FC<{
  title: string;
  subtitle?: string;
  accent?: string;
}> = ({ title, subtitle, accent = "#FFD60A" }) => (
  <div
    style={{
      position: "absolute",
      left: 52,
      top: 185,
      backgroundColor: "rgba(10, 14, 22, 0.92)",
      border: "2.5px solid rgba(255, 255, 255, 0.16)",
      borderLeft: `6px solid ${accent}`,
      boxShadow: "0 12px 28px rgba(0, 0, 0, 0.72)",
      padding: "10px 18px",
      borderRadius: 6,
      zIndex: 28,
    }}
  >
    <div
      style={{
        color: accent,
        fontSize: 18,
        fontWeight: 900,
        letterSpacing: 2.2,
        fontFamily: "serif",
      }}
    >
      {title}
    </div>
    {subtitle && (
      <div
        style={{
          color: "#e5dec9",
          fontSize: 14,
          fontWeight: 600,
          marginTop: 2,
          letterSpacing: 0.9,
        }}
      >
        {subtitle}
      </div>
    )}
  </div>
);
