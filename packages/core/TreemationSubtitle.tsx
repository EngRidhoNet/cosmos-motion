import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

export interface CaptionWord {
  display: string;
  start: number;
  end: number;
}

export interface TreemationCaption {
  text: string;
  start: number;
  end: number;
  highlight?: boolean;
  words?: CaptionWord[];
}

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const backOut = (x: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const bump = (dt: number, rise: number, fall: number): number => {
  if (dt < 0) return 0;
  if (dt < rise) return dt / rise;
  if (dt < rise + fall) return 1 - (dt - rise) / fall;
  return 0;
};

export const TreemationSubtitle: React.FC<{
  captions: TreemationCaption[];
  top?: number;
  accentColor?: string;
  strokeColor?: string;
}> = ({
  captions,
  top = 1315,
  accentColor = "#FFD60A",
  strokeColor = "#0a0d2a",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let activeCap: TreemationCaption | null = null;
  for (const c of captions) {
    if (t >= c.start - 0.02 && t < c.end) {
      activeCap = c;
      break;
    }
  }

  if (!activeCap) return null;

  const ws =
    activeCap.words && activeCap.words.length > 0
      ? activeCap.words
      : [{ display: activeCap.text, start: activeCap.start, end: activeCap.end }];

  let activeIdx = 0;
  ws.forEach((w, i) => {
    if (t >= w.start - 0.03) activeIdx = i;
  });

  const tail = /[?!]$/.test(activeCap.text) ? activeCap.text.slice(-1) : "";
  const k = clamp((t - (activeCap.start - 0.02)) / 0.14, 0, 1);
  const popScale = lerp(0.78, 1, backOut(k));
  const fontSize = activeCap.text.length > 18 ? 82 : 98;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 55 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1080,
          top,
          padding: "0 60px",
          textAlign: "center",
          fontFamily: `${poppins}, sans-serif`,
          fontWeight: 900,
          fontSize,
          lineHeight: 1.08,
          letterSpacing: "-1px",
          WebkitTextStroke: `16px ${strokeColor}`,
          paintOrder: "stroke fill",
          textShadow: "0 10px 0 rgba(5, 8, 35, 0.55)",
          transform: `scale(${popScale})`,
          transformOrigin: "center center",
        }}
      >
        {ws.map((w, i) => {
          const on = i === activeIdx;
          const sc = on ? lerp(1, 1.12, bump(t - w.start, 0.07, 0.25)) : 1;
          const col =
            activeCap!.highlight || on
              ? accentColor
              : t >= w.start - 0.03
                ? "#FFFFFF"
                : "rgba(255, 255, 255, 0.92)";
          const cleanWord =
            i === ws.length - 1 && tail && !w.display.endsWith(tail)
              ? `${w.display}${tail}`
              : w.display;

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: col,
                transform: `scale(${sc.toFixed(3)})`,
                margin: "0 12px",
              }}
            >
              {cleanWord}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
