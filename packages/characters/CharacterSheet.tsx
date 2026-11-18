import React from "react";
import { AbsoluteFill } from "remotion";
import { CHARACTER_PRESETS, HistoricalCharacterSpec } from "./CharacterSchema";
import { HistoricalActor } from "./GraphicNovelRig";

export const CharacterReferenceSheet: React.FC<{
  specs?: HistoricalCharacterSpec[];
}> = ({ specs = Object.values(CHARACTER_PRESETS) }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0c121c",
        padding: 48,
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          color: "#FFD60A",
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: 3,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        COSMOSMOTION · CHARACTER CONSISTENCY REFERENCE SHEET
      </div>

      <svg width="984" height="1700" viewBox="0 0 984 1700">
        {specs.slice(0, 3).map((spec, rowIdx) => {
          const cy = 260 + rowIdx * 540;
          return (
            <g key={spec.id}>
              <rect
                x="12"
                y={cy - 220}
                width="960"
                height="490"
                rx="16"
                fill="rgba(18, 25, 38, 0.9)"
                stroke="#334155"
                strokeWidth="3"
              />
              <text x="40" y={cy - 175} fill="#FFD60A" fontSize="24" fontWeight="900">
                {spec.name}
              </text>
              <text x="40" y={cy - 146} fill="#94a3b8" fontSize="16" fontWeight="700">
                {spec.era}
              </text>

              <HistoricalActor spec={spec} view="front" x={200} y={cy + 30} scale={0.92} emotion="neutral" />
              <HistoricalActor spec={spec} view="threeQuarter" x={492} y={cy + 30} scale={0.92} emotion="warm" propR="wheat" />
              <HistoricalActor spec={spec} view="profile" x={784} y={cy + 30} scale={0.92} emotion="focused" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
