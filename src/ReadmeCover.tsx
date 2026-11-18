import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Dust, LightShafts } from "@cosmos-motion/core";
import { HistoricalActor } from "@cosmos-motion/characters";
import { RealEarth3D } from "@cosmos-motion/geo-space";

export const ReadmeCover: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060a14",
        overflow: "hidden",
        fontFamily: "serif",
      }}
    >
      {/* Subtle NASA Blue Marble Background */}
      <img
        src={staticFile("assets/earth/nasa_blue_marble_2048.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.22,
          filter: "blur(3px) saturate(1.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 75% 50%, rgba(56,189,248,0.16) 0%, rgba(6,10,20,0.92) 72%)",
        }}
      />

      {/* Right Side 3D NASA Earth + Historical Scientist */}
      <div style={{ position: "absolute", right: 40, top: 40, width: 560, height: 560 }}>
        <RealEarth3D
          width={560}
          height={560}
          startLon={30}
          endLon={30}
          startLat={28}
          endLat={28}
          cameraDist={2.5}
          markerLon={30.31}
          markerLat={59.93}
        />
      </div>
      <svg
        width="1280"
        height="640"
        viewBox="0 0 1280 640"
        style={{ position: "absolute", inset: 0 }}
      >
        <HistoricalActor
          spec="nikolai_vavilov"
          x={1115}
          y={485}
          scale={0.85}
          emotion="warm"
          shR={-24}
          elR={-42}
          propR="wheat"
          rimLight="#FFD60A"
        />
      </svg>

      {/* Left Side Typography & Badges */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 96,
          width: 720,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "rgba(255, 214, 10, 0.14)",
            border: "1.5px solid #FFD60A",
            borderRadius: 6,
            padding: "6px 14px",
            color: "#FFD60A",
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 2.5,
            fontFamily: "sans-serif",
          }}
        >
          OPEN-SOURCE SCIENCE DOCUMENTARY ENGINE
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: 78,
            fontWeight: 900,
            letterSpacing: 2,
            marginTop: 18,
            lineHeight: 1.02,
          }}
        >
          Cosmos<span style={{ color: "#FFD60A" }}>Motion</span>
        </div>

        <div
          style={{
            color: "#cbd5e1",
            fontSize: 23,
            fontWeight: 500,
            marginTop: 20,
            lineHeight: 1.45,
            fontFamily: "sans-serif",
          }}
        >
          Code-first vertical documentary framework inspired by{" "}
          <strong style={{ color: "#7dd3fc" }}>Cosmos: A Spacetime Odyssey</strong> —
          featuring 3D NASA Blue Marble Earth, real cartography, consistent 2D
          graphic-novel rigs, and verified citations.
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 34,
            fontFamily: "monospace",
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          {["REMOTION", "THREE.JS", "D3-GEO", "OPENSTREETMAP", "PYTHON CLI", "MIT LICENSE"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1.5px solid rgba(125, 211, 252, 0.45)",
                  color: "#e2e8f0",
                  padding: "6px 12px",
                  borderRadius: 6,
                }}
              >
                {tag}
              </div>
            ),
          )}
        </div>
      </div>

      <LightShafts x={820} y={0} angle={18} color="125, 211, 252" intensity={0.16} count={3} />
      <Dust count={20} color="255, 214, 10" />
    </AbsoluteFill>
  );
};
