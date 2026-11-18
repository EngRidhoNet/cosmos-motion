import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

/* =========================================================================
 * COSMOS MOTION — CAMERA RIG & CINEMATOGRAPHY PRIMITIVES
 *  - CinemaCam    : Eased dolly / pan / crane / pushDiag + handheld micro-sway
 *  - PhotoPlate   : Archival photo with grade, Ken Burns, depth blur, vignette
 *  - Boil         : Hand-drawn 10fps SVG boiling line displacement
 *  - Dust         : Drifting dust/frost motes with secondary motion
 *  - LightShafts  : Volumetric window/spotlight rays with organic flicker
 *  - GroundShadow : Soft contact shadow so actors sit on the floor
 *  - FilmLook     : Global grain + split grade + optical vignette
 * ========================================================================= */

export const easeIO = Easing.bezier(0.45, 0.05, 0.25, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const ease = (
  frame: number,
  a: number,
  b: number,
  from: number,
  to: number,
  fn = easeIO,
) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fn,
  });

export function gesture(
  frame: number,
  keysOrFrames: Array<[number, number]> | number[],
  values?: number[],
): number {
  const keys: Array<[number, number]> = Array.isArray(values)
    ? (keysOrFrames as number[]).map((f, i) => [f, values[i] ?? values[values.length - 1]])
    : (keysOrFrames as Array<[number, number]>);

  if (keys.length === 0) return 0;
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i];
    const [f1, v1] = keys[i + 1];
    if (frame <= f1) return ease(frame, f0, f1, v0, v1);
  }
  return keys[keys.length - 1][1];
}

export type CamMove =
  | "dollyIn"
  | "dollyOut"
  | "panL"
  | "panR"
  | "trackRight"
  | "trackLeft"
  | "craneUp"
  | "craneDown"
  | "pushDiag"
  | "still";

export const CinemaCam: React.FC<{
  move?: CamMove;
  duration?: number;
  durationInFrames?: number;
  amount?: number;
  zoomFrom?: number;
  zoomTo?: number;
  panXFrom?: number;
  panXTo?: number;
  panYFrom?: number;
  panYTo?: number;
  originX?: number;
  originY?: number;
  dutchDeg?: number;
  children: React.ReactNode;
}> = ({
  move = "dollyIn",
  duration,
  durationInFrames,
  amount = 1,
  zoomFrom,
  zoomTo,
  panXFrom,
  panXTo,
  panYFrom,
  panYTo,
  originX = 540,
  originY = 880,
  dutchDeg = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const dur = duration ?? durationInFrames ?? 120;
  const t = ease(frame, 0, dur, 0, 1);
  let s = 1;
  let x = 0;
  let y = 0;

  switch (move) {
    case "dollyIn":
      s =
        zoomFrom !== undefined && zoomTo !== undefined
          ? zoomFrom + (zoomTo - zoomFrom) * t
          : 1 + 0.085 * amount * t;
      break;
    case "dollyOut":
      s =
        zoomFrom !== undefined && zoomTo !== undefined
          ? zoomFrom + (zoomTo - zoomFrom) * t
          : 1 + 0.085 * amount * (1 - t);
      break;
    case "panL":
    case "trackLeft":
      s =
        zoomFrom !== undefined && zoomTo !== undefined
          ? zoomFrom + (zoomTo - zoomFrom) * t
          : 1.06;
      x =
        panXFrom !== undefined && panXTo !== undefined
          ? panXFrom + (panXTo - panXFrom) * t
          : 32 * amount * (1 - 2 * t);
      break;
    case "panR":
    case "trackRight":
      s =
        zoomFrom !== undefined && zoomTo !== undefined
          ? zoomFrom + (zoomTo - zoomFrom) * t
          : 1.06;
      x =
        panXFrom !== undefined && panXTo !== undefined
          ? panXFrom + (panXTo - panXFrom) * t
          : -32 * amount * (1 - 2 * t);
      break;
    case "craneUp":
      s =
        zoomFrom !== undefined && zoomTo !== undefined
          ? zoomFrom + (zoomTo - zoomFrom) * t
          : 1.05;
      y =
        panYFrom !== undefined && panYTo !== undefined
          ? panYFrom + (panYTo - panYFrom) * t
          : 40 * amount * (1 - 2 * t);
      break;
    case "craneDown":
      s =
        zoomFrom !== undefined && zoomTo !== undefined
          ? zoomFrom + (zoomTo - zoomFrom) * t
          : 1.05;
      y =
        panYFrom !== undefined && panYTo !== undefined
          ? panYFrom + (panYTo - panYFrom) * t
          : -40 * amount * (1 - 2 * t);
      break;
    case "pushDiag":
      s =
        zoomFrom !== undefined && zoomTo !== undefined
          ? zoomFrom + (zoomTo - zoomFrom) * t
          : 1 + 0.07 * amount * t;
      x =
        panXFrom !== undefined && panXTo !== undefined
          ? panXFrom + (panXTo - panXFrom) * t
          : -20 * amount * t;
      y =
        panYFrom !== undefined && panYTo !== undefined
          ? panYFrom + (panYTo - panYFrom) * t
          : -14 * amount * t;
      break;
  }

  if (panXFrom !== undefined && panXTo !== undefined && move === "dollyIn") {
    x = panXFrom + (panXTo - panXFrom) * t;
  }
  if (panYFrom !== undefined && panYTo !== undefined && move === "dollyIn") {
    y = panYFrom + (panYTo - panYFrom) * t;
  }

  const hx = Math.sin(frame * 0.071) * 1.4 + Math.sin(frame * 0.173 + 1.3) * 0.6;
  const hy = Math.cos(frame * 0.058) * 1.1 + Math.sin(frame * 0.149 + 0.4) * 0.5;
  const hr = dutchDeg + Math.sin(frame * 0.043) * 0.1;

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x + hx}px, ${y + hy}px) rotate(${hr}deg) scale(${s})`,
        transformOrigin: `${originX}px ${originY}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const GRADES: Record<string, string> = {
  warm: "sepia(0.45) saturate(0.92) contrast(1.12) brightness(0.84)",
  sepia: "sepia(0.65) saturate(0.85) contrast(1.14) brightness(0.82)",
  cold: "grayscale(0.55) sepia(0.15) hue-rotate(165deg) saturate(1.1) contrast(1.15) brightness(0.8)",
  cool: "grayscale(0.45) sepia(0.12) hue-rotate(160deg) saturate(1.08) contrast(1.14) brightness(0.82)",
  frost: "grayscale(0.5) sepia(0.18) hue-rotate(170deg) saturate(1.15) contrast(1.18) brightness(0.82)",
  mono: "grayscale(1) contrast(1.2) brightness(0.8) sepia(0.2)",
  natural: "saturate(0.92) contrast(1.1) brightness(0.88)",
  dusk: "sepia(0.35) saturate(0.9) contrast(1.15) brightness(0.66) hue-rotate(-8deg)",
};

export const PhotoPlate: React.FC<{
  src: string;
  duration?: number;
  durationInFrames?: number;
  grade?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  fromScale?: number;
  toScale?: number;
  zoomFrom?: number;
  zoomTo?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  blur?: number;
  opacity?: number;
  fit?: "cover" | "contain";
  radius?: number;
  frame?: boolean;
  focus?: string;
}> = ({
  src,
  duration,
  durationInFrames,
  grade = "warm",
  x = 0,
  y = 0,
  w = 1080,
  h = 1920,
  fromScale,
  toScale,
  zoomFrom,
  zoomTo,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
  blur = 0,
  opacity = 1,
  fit = "cover",
  radius = 0,
  frame: framed = false,
  focus = "50% 50%",
}) => {
  const f = useCurrentFrame();
  const dur = duration ?? durationInFrames ?? 120;
  const s0 = zoomFrom ?? fromScale ?? 1.04;
  const s1 = zoomTo ?? toScale ?? 1.15;
  const sc = ease(f, 0, dur, s0, s1);
  const px = ease(f, 0, dur, fromX, toX);
  const py = ease(f, 0, dur, fromY, toY);
  const filterGrade = GRADES[grade] || GRADES.warm;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        overflow: "hidden",
        borderRadius: radius,
        opacity,
        border: framed ? "6px solid #0a0908" : undefined,
        boxShadow: framed ? "0 18px 50px rgba(0,0,0,.65)" : undefined,
      }}
    >
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          objectPosition: focus,
          transform: `translate(${px}px, ${py}px) scale(${sc})`,
          filter: `${filterGrade}${blur ? ` blur(${blur}px)` : ""}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(4,5,8,.72) 100%)",
        }}
      />
    </div>
  );
};

export const ArchiveCredit: React.FC<{
  text?: string;
  label?: string;
  source?: string;
  right?: boolean | number;
  top?: number;
}> = ({ text, label, source, right = false, top = 1262 }) => {
  const display = text || (source ? `${label} · ${source}` : label) || "";
  const rightOffset = typeof right === "number" ? right : right ? 56 : undefined;
  const leftOffset = rightOffset === undefined ? 56 : undefined;
  return (
    <div
      style={{
        position: "absolute",
        right: rightOffset,
        left: leftOffset,
        top,
        padding: "5px 12px",
        background: "rgba(6,8,12,.86)",
        border: "1.5px solid rgba(255,214,10,0.35)",
        color: "#cbd5e1",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0.5,
        borderRadius: 4,
        zIndex: 30,
        fontFamily: "sans-serif",
        maxWidth: 720,
      }}
    >
      {display}
    </div>
  );
};

export const Boil: React.FC<{
  id?: string;
  children: React.ReactNode;
  strength?: number;
  intensity?: number;
  style?: React.CSSProperties;
}> = ({ id: customId, children, strength, intensity, style }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 3) % 7;
  const scaleVal = strength ?? (intensity !== undefined ? intensity * 1.8 : 2.2);
  const filterId = `${customId || "boil"}-${seed}`;
  return (
    <AbsoluteFill style={{ filter: `url(#${filterId})`, ...style }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.022"
              numOctaves="2"
              seed={seed + 3}
              result="n"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale={scaleVal}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </AbsoluteFill>
  );
};

export const Dust: React.FC<{
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
}> = ({ count = 34, color = "255,236,200", speed = 1, size = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        {Array.from({ length: count }).map((_, i) => {
          const r1 = ((i * 9301 + 49297) % 233280) / 233280;
          const r2 = ((i * 4001 + 12345) % 233280) / 233280;
          const r3 = ((i * 7211 + 777) % 233280) / 233280;
          const x = r1 * 1080 + Math.sin(frame * 0.012 * speed + i) * 38;
          const y =
            (((r2 * 1920 - frame * (0.28 + r3 * 0.55) * speed) % 1920) + 1920) %
            1920;
          const rad = (0.8 + r3 * 2.2) * Math.min(size, 2.2);
          const o =
            (0.12 + r3 * 0.34) * (0.6 + 0.4 * Math.sin(frame * 0.05 + i * 1.7));
          return (
            <circle key={i} cx={x} cy={y} r={rad} fill={`rgba(${color},${o})`} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const LightShafts: React.FC<{
  color?: string;
  angle?: number;
  originX?: number;
  x?: number;
  y?: number;
  strength?: number;
  intensity?: number;
  count?: number;
}> = ({
  color = "255,214,140",
  angle = 18,
  originX,
  x,
  y = 0,
  strength,
  intensity,
  count = 3,
}) => {
  const frame = useCurrentFrame();
  const ox = x ?? originX ?? 640;
  const str = strength ?? intensity ?? 0.22;
  const flick =
    0.85 + Math.sin(frame * 0.045) * 0.08 + Math.sin(frame * 0.131) * 0.05;
  const gradId = `shaft-${ox}-${Math.round(angle)}`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${ox}px ${y}px`,
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`rgba(${color},${str * flick})`} />
            <stop offset="1" stopColor={`rgba(${color},0)`} />
          </linearGradient>
        </defs>
        {Array.from({ length: count }).map((_, i) => (
          <polygon
            key={i}
            points={`${ox - 90 + i * 115},${y - 80} ${ox + 25 + i * 115},${y - 80} ${ox + 210 + i * 175},1650 ${ox - 170 + i * 175},1650`}
            fill={`url(#${gradId})`}
            opacity={Math.max(0.18, 0.55 - i * 0.11)}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const GroundShadow: React.FC<{
  x: number;
  y: number;
  w?: number;
  o?: number;
}> = ({ x, y, w = 330, o = 0.55 }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - 22,
      width: w,
      height: 44,
      borderRadius: "50%",
      background: `radial-gradient(ellipse at center, rgba(0,0,0,${o}) 0%, rgba(0,0,0,0) 70%)`,
      filter: "blur(4px)",
    }}
  />
);

export const FilmLook: React.FC<{ warmth?: number; vignette?: number }> = ({
  warmth = 0.12,
  vignette = 0.55,
}) => {
  const frame = useCurrentFrame();
  const seed = frame % 11;
  const id = `grain-${seed}`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 90 }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={id} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="1"
              seed={seed}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${id})`,
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,190,110,${warmth * 0.35}) 0%, rgba(20,60,90,0.06) 100%)`,
          mixBlendMode: "soft-light",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(130% 95% at 50% 46%, transparent 54%, rgba(2,3,6,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
