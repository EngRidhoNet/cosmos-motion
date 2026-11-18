import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Boil,
  CaptionStamp,
  CinemaCam,
  FilmLook,
  LightShafts,
  SourceBadge,
  gesture,
} from "@cosmos-motion/core";
import {
  ActorProp,
  CHARACTER_PRESETS,
  HistoricalActor,
  HistoricalCharacterSpec,
} from "@cosmos-motion/characters";

export const SplitConfrontation: React.FC<{
  title: string;
  subtitle?: string;
  durationInFrames?: number;
  leftActor: HistoricalCharacterSpec | keyof typeof CHARACTER_PRESETS;
  rightActor: HistoricalCharacterSpec | keyof typeof CHARACTER_PRESETS;
  leftLabel: string;
  rightLabel: string;
  leftProp?: ActorProp;
  rightProp?: ActorProp;
  citation: string;
}> = ({
  title,
  subtitle,
  durationInFrames = 140,
  leftActor,
  rightActor,
  leftLabel,
  rightLabel,
  leftProp = "notebook",
  rightProp = "point",
  citation,
}) => {
  const frame = useCurrentFrame();
  const leftArm = gesture(frame, [0, 40, 90, durationInFrames], [-22, -38, -28, -36]);
  const rightArm = gesture(frame, [0, 35, 80, durationInFrames], [-45, -72, -55, -68]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#14090c", overflow: "hidden" }}>
      <CaptionStamp title={title} subtitle={subtitle} accent="#e63946" />
      <SourceBadge category="ARSIP SEJARAH" source={citation} />

      <CinemaCam
        durationInFrames={durationInFrames}
        move="dollyIn"
        zoomFrom={1.01}
        zoomTo={1.08}
      >
        <Boil id="split-confrontation" intensity={1.1}>
          <svg width="1080" height="1920" viewBox="0 0 1080 1920">
            <rect x="0" y="0" width="540" height="1920" fill="#17242c" />
            <rect x="540" y="0" width="540" height="1920" fill="#2d0a10" />
            <line x1="540" y1="0" x2="540" y2="1920" stroke="#0a0908" strokeWidth="9" />

            <g transform="translate(56, 330)">
              <rect
                x="0"
                y="0"
                width="428"
                height="130"
                rx="10"
                fill="rgba(12, 22, 30, 0.92)"
                stroke="#52b788"
                strokeWidth="3.5"
              />
              <text
                x="214"
                y="74"
                textAnchor="middle"
                fill="#52b788"
                fontSize="21"
                fontWeight="900"
                fontFamily="serif"
              >
                {leftLabel}
              </text>
            </g>

            <g transform="translate(596, 330)">
              <rect
                x="0"
                y="0"
                width="428"
                height="130"
                rx="10"
                fill="rgba(28, 8, 12, 0.94)"
                stroke="#e63946"
                strokeWidth="3.5"
              />
              <text
                x="214"
                y="74"
                textAnchor="middle"
                fill="#e63946"
                fontSize="21"
                fontWeight="900"
                fontFamily="serif"
              >
                {rightLabel}
              </text>
            </g>

            <HistoricalActor
              spec={leftActor}
              view="threeQuarter"
              x={265}
              y={1145}
              scale={1.18}
              emotion="focused"
              speaking
              shR={-24}
              elR={leftArm}
              propR={leftProp}
              rimLight="#7dd3fc"
            />

            <HistoricalActor
              spec={rightActor}
              view="threeQuarter"
              flip
              x={815}
              y={1145}
              scale={1.18}
              emotion="angry"
              shR={rightArm}
              elR={-14}
              propR={rightProp}
              rimLight="#e63946"
            />

            <rect x="0" y="1325" width="1080" height="595" fill="#181214" stroke="#0a0908" strokeWidth="6" />
          </svg>
        </Boil>

        <LightShafts x={270} y={200} angle={14} color="125, 211, 252" intensity={0.18} count={3} />
        <LightShafts x={810} y={200} angle={-14} color="230, 57, 70" intensity={0.22} count={3} />
      </CinemaCam>
      <FilmLook warmth={0.14} vignette={0.6} />
    </AbsoluteFill>
  );
};
