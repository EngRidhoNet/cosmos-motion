import React from "react";
import { useCurrentFrame } from "remotion";
import {
  ActorProp,
  CHARACTER_PRESETS,
  EmotionState,
  HeadView,
  HistoricalCharacterSpec,
} from "./CharacterSchema";

const INK = "#0a0908";

const CrossHatchBlock: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
}> = ({ x, y, w, h, opacity = 0.4 }) => {
  const lines = [];
  const step = 7;
  for (let i = 0; i <= w + h; i += step) {
    lines.push(
      <line
        key={`ch-${i}`}
        x1={x + Math.max(0, i - h)}
        y1={y + Math.min(h, i)}
        x2={x + Math.min(w, i)}
        y2={y + Math.max(0, i - w)}
        stroke={INK}
        strokeWidth="1.5"
        opacity={opacity}
      />,
    );
  }
  return <g>{lines}</g>;
};

export const HistoricalHead: React.FC<{
  spec: HistoricalCharacterSpec;
  view: HeadView;
  emotion: EmotionState;
  gazeX: number;
  gazeY: number;
  isBlinking: boolean;
  viseme?: string;
  rimLight?: string;
}> = ({
  spec: S,
  view,
  emotion,
  gazeX,
  gazeY,
  isBlinking,
  viseme = "-",
  rimLight,
}) => {
  const isAngular = S.hairStyle === "severe_forelock" || S.isGaunt;
  const browRotL =
    emotion === "angry"
      ? 18
      : emotion === "worried" || emotion === "starving"
        ? -15
        : emotion === "excited"
          ? -8
          : -3;
  const browRotR = -browRotL;
  const browDY =
    emotion === "excited"
      ? -5
      : emotion === "angry"
        ? 4
        : emotion === "worried" || emotion === "starving"
          ? -3
          : 0;

  if (view === "profile") {
    return (
      <g>
        <path
          d="M -24 12 L -20 -34 L 18 -30 L 16 12 C 4 18, -12 18, -24 12 Z"
          fill={S.skinMid}
          stroke={INK}
          strokeWidth="4.5"
        />
        <path d="M -20 -30 L 18 -28 L 6 2 L -22 6 Z" fill={INK} />
        <path
          d="M -54 -120 C -70 -82, -66 -32, -40 -12 L -12 -18 L -14 -125 Z"
          fill={S.hair}
          stroke={INK}
          strokeWidth="4.5"
        />
        <path
          d="M -38 -124 C -10 -144, 28 -140, 38 -114 L 38 -90 L 52 -58 C 53 -52, 46 -48, 39 -48 L 42 -38 L 36 -33 L 40 -26 C 40 -14, 28 -8, 14 -8 C -6 -8, -26 -22, -36 -44 Z"
          fill={S.skin}
          stroke={INK}
          strokeWidth="4.8"
          strokeLinejoin="round"
        />
        <path
          d="M -34 -116 C -20 -85, -18 -50, -4 -22 L -28 -30 L -38 -75 Z"
          fill={S.skinMid}
        />
        <path
          d="M -22 -82 C -35 -86, -35 -50, -20 -48 C -14 -56, -14 -74, -22 -82 Z"
          fill={S.skinMid}
          stroke={INK}
          strokeWidth="4"
        />
        <g transform="translate(22, -80)">
          {isBlinking ? (
            <path d="M -10 2 L 10 2" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
          ) : (
            <g>
              <path d="M -10 -7 L 10 0 L -8 7 Z" fill="#fbf8f1" stroke={INK} strokeWidth="3.5" />
              <ellipse cx="4" cy="0" rx="4" ry="5.5" fill={S.iris} />
              <ellipse cx="5" cy="0" rx="2.2" ry="3.2" fill={INK} />
              <circle cx="3.5" cy="-2" r="1.5" fill="#ffffff" />
              <path d="M -12 -8 L 12 0" stroke={INK} strokeWidth="5" strokeLinecap="round" />
            </g>
          )}
        </g>
        <g transform={`translate(22, ${-96 + browDY}) rotate(${browRotR})`}>
          <path d="M -14 -2 Q 2 -7 14 1" fill="none" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
        </g>
        {S.hasMoustache && (
          <path
            d="M 22 -42 C 32 -44, 44 -40, 46 -34 C 38 -33, 28 -35, 20 -38 Z"
            fill={S.hair}
            stroke={INK}
            strokeWidth="2.5"
          />
        )}
        <path
          d={
            emotion === "warm" || emotion === "excited"
              ? "M 22 -31 Q 32 -27 39 -32"
              : emotion === "angry"
                ? "M 20 -29 Q 30 -35 39 -31"
                : "M 23 -31 L 38 -32"
          }
          fill="none"
          stroke={INK}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        {S.hasGlasses && (
          <g>
            <circle cx="24" cy="-80" r="14" fill="rgba(180,220,240,0.2)" stroke="#2b2118" strokeWidth="3.2" />
            <line x1="-18" y1="-82" x2="10" y2="-80" stroke="#2b2118" strokeWidth="3" />
          </g>
        )}
        <path
          d="M -52 -96 C -58 -138, -10 -164, 30 -150 C 48 -142, 52 -122, 38 -110 C 18 -122, -6 -116, -14 -90 C -16 -66, -12 -50, -20 -42 C -34 -46, -38 -72, -52 -96 Z"
          fill={S.hair}
          stroke={INK}
          strokeWidth="4.2"
        />
        <path d="M -20 -142 Q 10 -150 32 -134 Q 10 -128 -14 -130 Z" fill={S.hairHi} />
      </g>
    );
  }

  const turnShift = view === "threeQuarter" ? 10 : 0;

  return (
    <g>
      <path
        d="M -22 10 L -20 -32 L 22 -32 L 24 10 C 10 18, -10 18, -22 10 Z"
        fill={S.skin}
        stroke={INK}
        strokeWidth="4.5"
      />
      <path d="M -20 -30 L 20 -30 L 8 0 L -20 5 Z" fill={INK} />
      <path d="M -49 -78 C -61 -82, -61 -52, -47 -50 Z" fill={S.skinMid} stroke={INK} strokeWidth="4" />
      {view === "front" && (
        <path d="M 49 -78 C 61 -82, 61 -52, 47 -50 Z" fill={S.skin} stroke={INK} strokeWidth="4" />
      )}
      <path
        d={
          isAngular
            ? "M -45 -122 C -49 -86, -44 -48, -26 -24 C -12 -9, -3 -6, 4 -6 C 12 -6, 24 -10, 36 -26 C 46 -48, 48 -88, 43 -122 C 28 -148, -28 -148, -45 -122 Z"
            : "M -49 -122 C -54 -86, -50 -48, -32 -25 C -18 -10, -6 -7, 4 -7 C 16 -7, 28 -12, 40 -26 C 52 -48, 52 -88, 47 -122 C 30 -148, -30 -148, -49 -122 Z"
        }
        fill={S.skin}
        stroke={INK}
        strokeWidth="4.8"
        strokeLinejoin="round"
      />
      <path
        d="M -45 -118 C -48 -84, -44 -50, -28 -28 C -16 -14, -6 -9, 2 -9 C -10 -24, -20 -50, -22 -86 C -24 -106, -32 -118, -45 -118 Z"
        fill={S.skinMid}
      />
      <path d="M -47 -110 C -48 -82, -43 -54, -30 -34 C -36 -58, -38 -86, -36 -112 Z" fill={INK} />
      {rimLight && (
        <path
          d="M 43 -112 C 47 -82, 45 -52, 35 -30 C 40 -54, 41 -82, 38 -110 Z"
          fill={rimLight}
          opacity="0.72"
        />
      )}
      <path d="M -32 -58 Q -22 -45 -16 -36" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M 34 -58 Q 26 -45 20 -36" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      {S.isGaunt && (
        <g stroke={INK} strokeWidth="2.4" opacity="0.65" fill="none">
          <path d="M -35 -68 Q -24 -54 -28 -38" />
          <path d="M 35 -68 Q 26 -54 30 -38" />
        </g>
      )}
      <g transform={`translate(${turnShift}, 0)`}>
        {[-21, 21].map((ex, idx) => (
          <g key={idx} transform={`translate(${ex}, -80)`}>
            {isBlinking ? (
              <path d="M -14 2 Q 0 8 14 2" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
            ) : (
              <g>
                <path d="M -14 2 Q 0 -11 14 2 Q 0 11 -14 2 Z" fill="#fbf8f1" stroke={INK} strokeWidth="3.5" />
                <circle cx={gazeX * 4.5} cy={gazeY * 2.5} r="5.8" fill={S.iris} />
                <circle cx={gazeX * 4.5} cy={gazeY * 2.5} r="3.0" fill={INK} />
                <circle cx={gazeX * 4.5 - 2} cy={gazeY * 2.5 - 2} r="1.8" fill="#ffffff" />
                <path d="M -15 2 Q 0 -13 15 2" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
              </g>
            )}
          </g>
        ))}
        <g transform={`translate(-21, ${-96 + browDY}) rotate(${browRotL})`}>
          <path d="M -16 2 Q 0 -6 16 0" fill="none" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
        </g>
        <g transform={`translate(21, ${-96 + browDY}) rotate(${browRotR})`}>
          <path d="M -16 0 Q 0 -6 16 2" fill="none" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
        </g>
        {S.hasGlasses && (
          <g stroke="#241c15" strokeWidth="3.4" fill="rgba(190, 230, 245, 0.22)">
            <circle cx="-21" cy="-80" r="16" />
            <circle cx="21" cy="-80" r="16" />
            <line x1="-5" y1="-80" x2="5" y2="-80" />
          </g>
        )}
        <path
          d="M 1 -82 L 6 -54 C 8 -49, 3 -46, -3 -46"
          fill="none"
          stroke={INK}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path d="M -8 -48 Q 0 -41 9 -48 L 2 -42 Z" fill={INK} />
        {S.hasMoustache && (
          <path
            d="M -22 -34 C -16 -43, -4 -44, 1 -39 C 6 -44, 18 -43, 24 -34 C 14 -32, 6 -34, 1 -35 C -4 -34, -12 -32, -22 -34 Z"
            fill={S.hair}
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        )}
        <g transform="translate(1, -27)">
          {viseme === "A" || viseme === "O" ? (
            <ellipse
              cx="0"
              cy="2"
              rx={viseme === "A" ? 11 : 8}
              ry={viseme === "A" ? 7 : 8}
              fill="#4a1515"
              stroke={INK}
              strokeWidth="3.5"
            />
          ) : viseme === "E" || viseme === "I" || viseme === "U" ? (
            <rect
              x={viseme === "U" ? -7 : -12}
              y="-2"
              width={viseme === "U" ? 14 : 24}
              height="6"
              rx="3"
              fill="#4a1515"
              stroke={INK}
              strokeWidth="3.2"
            />
          ) : emotion === "warm" || emotion === "excited" ? (
            <path d="M -14 -2 Q 0 6 14 -2" fill="none" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
          ) : emotion === "angry" ? (
            <path d="M -15 4 Q 0 -5 15 4" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          ) : emotion === "worried" || emotion === "starving" ? (
            <path d="M -13 4 Q 0 -2 13 4" fill="none" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
          ) : (
            <path d="M -13 0 Q 2 2 14 -2" fill="none" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
          )}
        </g>
      </g>
      {S.hairStyle === "severe_forelock" ? (
        <g>
          <path
            d="M -48 -98 C -56 -136, -24 -160, 12 -154 C 44 -150, 56 -124, 48 -96 C 38 -118, 18 -126, -8 -120 L -24 -94 L -32 -116 C -40 -112, -44 -104, -48 -98 Z"
            fill={S.hair}
            stroke={INK}
            strokeWidth="4.2"
          />
          <path d="M -18 -124 L 6 -92 L 16 -120 Z" fill={S.hair} stroke={INK} strokeWidth="3.2" />
        </g>
      ) : (
        <g>
          <path
            d="M -52 -96 C -62 -136, -24 -162, 8 -156 C 42 -156, 62 -128, 52 -94 C 42 -118, 22 -128, -10 -122 C -26 -118, -42 -110, -52 -96 Z"
            fill={S.hair}
            stroke={INK}
            strokeWidth="4.2"
          />
          <path d="M -26 -142 Q 6 -152 32 -136 Q 8 -128 -20 -132 Z" fill={S.hairHi} />
        </g>
      )}
    </g>
  );
};

export const HistoricalActor: React.FC<{
  spec: HistoricalCharacterSpec | keyof typeof CHARACTER_PRESETS;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  view?: HeadView;
  emotion?: EmotionState;
  gazeX?: number;
  gazeY?: number;
  headTilt?: number;
  torsoLean?: number;
  shR?: number;
  elR?: number;
  propR?: ActorProp;
  shL?: number;
  elL?: number;
  propL?: ActorProp;
  walkSpeed?: number;
  visemes?: string[];
  speaking?: boolean;
  rimLight?: string;
}> = ({
  spec,
  x,
  y,
  scale = 1,
  flip = false,
  view = "threeQuarter",
  emotion = "warm",
  gazeX = 0.2,
  gazeY = 0,
  headTilt = 0,
  torsoLean = 0,
  shR = -5,
  elR = 6,
  propR = "none",
  shL = -4,
  elL = 6,
  propL = "none",
  walkSpeed = 0,
  visemes = [],
  speaking = false,
  rimLight,
}) => {
  const frame = useCurrentFrame();
  const S: HistoricalCharacterSpec =
    typeof spec === "string" ? CHARACTER_PRESETS[spec] || CHARACTER_PRESETS.nikolai_vavilov : spec;

  const breathe = Math.sin(frame * 0.065) * 2.2 + Math.cos(frame * 0.032) * 0.8;
  const walkPhase = walkSpeed > 0 ? frame * walkSpeed : 0;
  const walkBob = walkSpeed > 0 ? Math.abs(Math.sin(walkPhase)) * 6.5 : 0;
  const legSwing = walkSpeed > 0 ? Math.sin(walkPhase) * 22 : 0;

  const blinkMod = (frame + S.id.length * 17) % 96;
  const isBlinking = blinkMod >= 90 && blinkMod <= 94;
  const currentViseme = speaking && frame < visemes.length ? visemes[frame] : "-";

  const safeShR = Math.min(4, shR);
  const safeElR = Math.min(18, elR);
  const safeShL = Math.min(4, shL);
  const safeElL = Math.min(18, elL);
  const scarfSway = Math.sin(frame * 0.09 + x * 0.01) * 5 + Math.cos(frame * 0.045) * 2.5;
  const breathCycle = (frame + (S.id.length * 11)) % 90;
  const breathAlpha =
    emotion === "starving" && breathCycle < 55
      ? Math.sin((breathCycle / 55) * Math.PI) * 0.36
      : 0;

  const renderHand = (prop: ActorProp, isBackArm = false) => {
    const skinFill = isBackArm ? S.skinMid : S.skin;
    return (
      <g transform="translate(0, 86)">
        <rect x="-11.5" y="-4" width="23" height="9" rx="2.5" fill={S.collar} stroke={INK} strokeWidth="3.2" />
        {prop === "wheat" && (
          <g transform="translate(6, 20) rotate(-35)">
            <line x1="-25" y1="0" x2="65" y2="0" stroke="#e9c46a" strokeWidth="4.5" strokeLinecap="round" />
            {[25, 38, 50, 62].map((wx, i) => (
              <g key={i} transform={`translate(${wx}, 0)`}>
                <ellipse cx="0" cy="-7" rx="8" ry="4" fill="#ffbe0b" stroke={INK} strokeWidth="2.2" transform="rotate(-20)" />
                <ellipse cx="0" cy="7" rx="8" ry="4" fill="#e9c46a" stroke={INK} strokeWidth="2.2" transform="rotate(20)" />
              </g>
            ))}
          </g>
        )}
        {prop === "seedJar" && (
          <g transform="translate(6, 28) rotate(12)">
            <rect x="-22" y="-18" width="44" height="56" rx="8" fill="rgba(210, 240, 250, 0.45)" stroke={INK} strokeWidth="4" />
            <rect x="-18" y="4" width="36" height="30" rx="4" fill="#e9c46a" />
            <rect x="-16" y="-25" width="32" height="8" rx="2" fill="#7f5539" stroke={INK} strokeWidth="3.2" />
            <rect x="-14" y="10" width="28" height="12" fill="#f4efe6" stroke={INK} strokeWidth="2" />
          </g>
        )}
        {prop === "notebook" && (
          <g transform="translate(8, 24) rotate(-18)">
            <rect x="-26" y="-18" width="52" height="38" rx="4" fill="#7f4f24" stroke={INK} strokeWidth="3.8" />
            <rect x="-22" y="-14" width="44" height="30" rx="2" fill="#f4efe6" stroke={INK} strokeWidth="2.5" />
          </g>
        )}
        <path
          d="M -10 4 C -13 12, -12 22, -7 27 L 8 27 C 13 22, 13 12, 10 4 Z"
          fill={skinFill}
          stroke={INK}
          strokeWidth="3.8"
          strokeLinejoin="round"
        />
        {prop === "point" ? (
          <g>
            <rect x="-9" y="20" width="11" height="10" rx="4" fill={S.skinMid} stroke={INK} strokeWidth="3.2" />
            <path
              d="M 1 18 L 3 46 C 3 50, 10 50, 10 46 L 10 18 Z"
              fill={skinFill}
              stroke={INK}
              strokeWidth="3.6"
              strokeLinejoin="round"
            />
          </g>
        ) : (
          <path
            d="M -8 23 C -9 32, -6 38, -2 38 C 1 38, 3 36, 4 38 C 8 38, 11 32, 9 23 Z"
            fill={skinFill}
            stroke={INK}
            strokeWidth="3.6"
            strokeLinejoin="round"
          />
        )}
      </g>
    );
  };

  return (
    <g transform={`translate(${x}, ${y + breathe - walkBob}) scale(${flip ? -scale : scale}, ${scale})`}>
      <ellipse cx="0" cy="302" rx="88" ry="16" fill="rgba(0,0,0,0.52)" />
      <g transform="translate(0, 145)">
        <g transform={`translate(-28, 0) rotate(${-legSwing})`}>
          <path d="M -22 0 L 22 0 L 18 160 L -18 160 Z" fill="#1b1f1d" stroke={INK} strokeWidth="4.5" />
          <ellipse cx="2" cy="160" rx="22" ry="9" fill="#111312" stroke={INK} strokeWidth="4" />
        </g>
        <g transform={`translate(28, 0) rotate(${legSwing})`}>
          <path d="M -22 0 L 22 0 L 20 160 L -18 160 Z" fill="#252a27" stroke={INK} strokeWidth="4.5" />
          <ellipse cx="4" cy="160" rx="23" ry="9" fill="#161917" stroke={INK} strokeWidth="4" />
        </g>
      </g>

      <g transform={`rotate(${torsoLean + Math.sin(frame * 0.04) * 0.6})`}>
        <g transform={`translate(-66, -78) scale(-1, 1) rotate(${safeShL + Math.sin(frame * 0.06) * 1.8})`}>
          <path d="M -18 0 A 18 18 0 0 1 18 0 L 15 92 A 15 15 0 0 1 -15 92 Z" fill={S.coatMid} stroke={INK} strokeWidth="4.5" />
          <g transform={`translate(0, 90) rotate(${safeElL + Math.cos(frame * 0.06) * 1.5})`}>
            <path d="M -14 0 A 14 14 0 0 1 14 0 L 11 86 L -11 86 Z" fill={S.coatMid} stroke={INK} strokeWidth="4.5" />
            {renderHand(propL, true)}
          </g>
        </g>

        <path
          d="M -74 -92 C -45 -106, 45 -106, 74 -92 L 62 75 L 78 155 L -78 155 L -62 75 Z"
          fill={S.coat}
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M -72 -88 L -28 -96 L -38 35 L 18 62 L -60 76 L -75 152 L -78 152 L -62 75 Z"
          fill={S.coatMid}
        />

        <g transform={`translate(${view === "threeQuarter" ? 10 : view === "profile" ? 20 : 0}, 0)`}>
          <path d="M -38 -92 L 38 -92 L 30 82 L 0 98 L -30 82 Z" fill={S.vest} stroke={INK} strokeWidth="4" />
          <CrossHatchBlock x={-36} y={-20} w={28} h={75} opacity={0.35} />
          {[12, 34, 56, 76].map((by) => (
            <circle key={by} cx="0" cy={by} r="3.4" fill="#1b1613" stroke={INK} strokeWidth="1.8" />
          ))}
          {S.lapelPinColor && (
            <polygon points="34,-34 44,-34 41,-22 31,-22" fill={S.lapelPinColor} stroke={INK} strokeWidth="2" />
          )}
          <polygon points="-28,-102 0,-82 28,-102 18,-112 -18,-112" fill={S.collar} stroke={INK} strokeWidth="4" />
          <polygon points="-7,-90 7,-90 11,-28 0,-16 -11,-28" fill={S.tie} stroke={INK} strokeWidth="3.5" />
          {S.hasScarf && (
            <g>
              <path d="M -42 -102 Q 0 -82 42 -102 L 46 -78 Q 0 -62 -46 -78 Z" fill={S.tie} stroke={INK} strokeWidth="4.2" />
              <g transform={`translate(14, -80) rotate(${scarfSway})`}>
                <path d="M 0 0 L 18 68 L -4 72 L -14 2 Z" fill={S.tie} stroke={INK} strokeWidth="4" />
              </g>
            </g>
          )}
        </g>

        <g transform={`translate(0, -108) rotate(${headTilt + Math.sin(frame * 0.05) * 1.5})`}>
          <HistoricalHead
            spec={S}
            view={view}
            emotion={emotion}
            gazeX={gazeX + Math.sin(frame * 0.04) * 0.08}
            gazeY={gazeY}
            isBlinking={isBlinking}
            viseme={currentViseme}
            rimLight={rimLight}
          />
          {breathAlpha > 0.02 && (
            <g
              transform={`translate(${24 + breathCycle * 0.9}, ${-24 - breathCycle * 0.45}) scale(${0.6 + breathCycle * 0.018})`}
              opacity={breathAlpha}
            >
              <ellipse cx="0" cy="0" rx="22" ry="12" fill="rgba(215, 240, 255, 0.55)" />
            </g>
          )}
        </g>

        <g transform={`translate(66, -78) rotate(${safeShR + Math.sin(frame * 0.075) * 2})`}>
          <path d="M -18 0 A 18 18 0 0 1 18 0 L 15 92 A 15 15 0 0 1 -15 92 Z" fill={S.coat} stroke={INK} strokeWidth="4.8" />
          <g transform={`translate(0, 90) rotate(${safeElR + Math.cos(frame * 0.075) * 2.2})`}>
            <path d="M -14.5 0 A 14.5 14.5 0 0 1 14.5 0 L 11 86 L -11 86 Z" fill={S.coat} stroke={INK} strokeWidth="4.8" />
            {renderHand(propR, false)}
          </g>
        </g>
      </g>
    </g>
  );
};
