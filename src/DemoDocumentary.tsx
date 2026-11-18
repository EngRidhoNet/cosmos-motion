import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  Boil,
  CaptionStamp,
  CinemaCam,
  DocumentaryChrome,
  Dust,
  FilmLook,
  ReferenceEndCard,
  SmoothShotWrapper,
  SourceBadge,
  SourceEntry,
  TreemationCaption,
  TreemationSubtitle,
} from "@cosmos-motion/core";
import { HistoricalActor } from "@cosmos-motion/characters";
import { NaturalEarthMap, RealEarth3D } from "@cosmos-motion/geo-space";
import { DataTimelineShot, SplitConfrontation } from "@cosmos-motion/scenes";

export const DEMO_TOTAL_FRAMES = 450; // 15.0s @ 30fps

const DEMO_SOURCES: SourceEntry[] = [
  {
    id: "nasa-blue-marble",
    category: "CITRA BUMI",
    title: "NASA Visible Earth",
    citation: "Blue Marble Next Generation & Earth Observatory",
    license: "Public Domain",
  },
  {
    id: "natural-earth",
    category: "DATA PETA",
    title: "Natural Earth 110m",
    citation: "naturalearthdata.com Vector Countries & Coastlines",
    license: "Public Domain",
  },
  {
    id: "vir-archive",
    category: "SUMBER ILMIAH",
    title: "N.I. Vavilov Institute (VIR)",
    citation: "Parkin, S. (2024) The Forbidden Garden of Leningrad; Pringle, P. (2008)",
  },
];

const DEMO_CAPTIONS: TreemationCaption[] = [
  {
    text: "Satu mimpi besar",
    start: 0.2,
    end: 2.2,
    words: [
      { display: "Satu", start: 0.2, end: 0.8 },
      { display: "mimpi", start: 0.8, end: 1.5 },
      { display: "besar", start: 1.5, end: 2.2 },
    ],
  },
  {
    text: "menjaga benih Bumi",
    start: 2.2,
    end: 4.5,
    highlight: true,
    words: [
      { display: "menjaga", start: 2.2, end: 3.0 },
      { display: "benih", start: 3.0, end: 3.7 },
      { display: "Bumi", start: 3.7, end: 4.5 },
    ],
  },
  {
    text: "64 negara dijelajahi",
    start: 4.8,
    end: 7.4,
    words: [
      { display: "64", start: 4.8, end: 5.6 },
      { display: "negara", start: 5.6, end: 6.5 },
      { display: "dijelajahi", start: 6.5, end: 7.4 },
    ],
  },
  {
    text: "250.000 sampel benih",
    start: 7.6,
    end: 10.6,
    highlight: true,
    words: [
      { display: "250.000", start: 7.6, end: 8.7 },
      { display: "sampel", start: 8.7, end: 9.6 },
      { display: "benih", start: 9.6, end: 10.6 },
    ],
  },
  {
    text: "sains melawan dogma",
    start: 11.2,
    end: 14.5,
    words: [
      { display: "sains", start: 11.2, end: 12.2 },
      { display: "melawan", start: 12.2, end: 13.4 },
      { display: "dogma", start: 13.4, end: 14.5 },
    ],
  },
];

const Scene01EarthHero: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#040914" }}>
    <CaptionStamp
      title="COSMOSMOTION ENGINE · BABAK I"
      subtitle="3D NASA BLUE MARBLE EARTH + HISTORICAL ACTOR RIG"
      accent="#52b788"
    />
    <SourceBadge
      category="CITRA BUMI"
      source="NASA Visible Earth (Blue Marble Next Generation)"
    />
    <CinemaCam durationInFrames={135} move="dollyIn">
      <div style={{ position: "absolute", left: 130, top: 290, width: 820, height: 820 }}>
        <RealEarth3D
          width={820}
          height={820}
          startLon={28}
          endLon={68}
          startLat={26}
          endLat={42}
          durationInFrames={135}
          markerLon={30.31}
          markerLat={59.93}
        />
      </div>
      <Boil id="demo-s1">
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          <HistoricalActor
            spec="nikolai_vavilov"
            x={340}
            y={1240}
            scale={1.3}
            emotion="warm"
            shR={-24}
            elR={-42}
            propR="wheat"
            rimLight="#7dd3fc"
          />
        </svg>
      </Boil>
      <Dust count={26} color="125,211,252" />
    </CinemaCam>
    <FilmLook warmth={0.08} vignette={0.55} />
  </AbsoluteFill>
);

const Scene02WorldMap: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#07111e" }}>
    <CaptionStamp
      title="PETA EKSPEDISI BOTANI DUNIA"
      subtitle="NATURAL EARTH 110M · KOORDINAT GEOGRAFIS NYATA"
    />
    <SourceBadge
      category="DATA PETA"
      source="Natural Earth 110m Vector Data (naturalearthdata.com)"
    />
    <CinemaCam durationInFrames={115} move="dollyIn">
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 325,
          width: 992,
          height: 650,
          borderRadius: 16,
          border: "4px solid #FFD60A",
          overflow: "hidden",
        }}
      >
        <NaturalEarthMap
          width={992}
          height={650}
          hubs={[
            { name: "LENINGRAD (VIR)", coords: [30.3351, 59.9343], color: "#FFD60A" },
            { name: "MEDITERANIA", coords: [12.4964, 41.9028], color: "#34d399" },
            { name: "ETHIOPIA", coords: [38.7578, 9.0054], color: "#ff6fae" },
            { name: "ASIA TIMUR", coords: [104.1954, 35.8617], color: "#FFD60A" },
            { name: "ANDES", coords: [-75.0152, -9.19], color: "#f4a261" },
          ]}
        />
      </div>
    </CinemaCam>
    <FilmLook warmth={0.06} vignette={0.52} />
  </AbsoluteFill>
);

export const DemoDocumentary: React.FC = () => {
  const frame = useCurrentFrame();
  const progressPct = interpolate(frame, [0, DEMO_TOTAL_FRAMES], [0, 100], {
    extrapolateRight: "clamp",
  });

  const actLabel =
    frame < 135
      ? "BABAK I · PLANET BUMI"
      : frame < 245
        ? "BABAK II · PETA EKSPEDISI"
        : frame < 345
          ? "BABAK III · DATA ILMIAH"
          : "BABAK IV · REFERENSI";

  return (
    <AbsoluteFill style={{ backgroundColor: "#07090d" }}>
      <Sequence from={0} durationInFrames={135}>
        <SmoothShotWrapper durationInFrames={135}>
          <Scene01EarthHero />
        </SmoothShotWrapper>
      </Sequence>

      <Sequence from={130} durationInFrames={115}>
        <SmoothShotWrapper durationInFrames={115}>
          <Scene02WorldMap />
        </SmoothShotWrapper>
      </Sequence>

      <Sequence from={240} durationInFrames={105}>
        <SmoothShotWrapper durationInFrames={105}>
          <DataTimelineShot
            title="KOLEKSI BANK BENIH VAVILOV"
            subtitle="DATA INVENTARIS INSTITUT VIR (1940)"
            metricLabel="TOTAL SAMPEL BENIH PANGAN DUNIA"
            startValue={15000}
            endValue={250000}
            unit=" SAMPEL"
            description="Dikumpulkan dari 64 negara di 5 benua"
            citation="N.I. Vavilov Institute of Plant Genetic Resources (VIR)"
            durationInFrames={105}
          />
        </SmoothShotWrapper>
      </Sequence>

      <Sequence from={340} durationInFrames={110}>
        <SmoothShotWrapper durationInFrames={110}>
          <AbsoluteFill>
            <SplitConfrontation
              title="SAINS EMPIRIS VS PSEUDOSAINS"
              subtitle="SIDANG AKADEMI VASKhNIL (1936–1939)"
              leftActor="nikolai_vavilov"
              rightActor="trofim_lysenko"
              leftLabel="GENETIKA MENDEL (VAVILOV)"
              rightLabel="IDEOLOGI POLITIK (LYSENKO)"
              citation="Soyfer (1994) · Pringle (2008)"
              durationInFrames={110}
            />
            <ReferenceEndCard sources={DEMO_SOURCES} />
          </AbsoluteFill>
        </SmoothShotWrapper>
      </Sequence>

      <DocumentaryChrome
        actLabel={actLabel}
        seriesTitle="COSMOSMOTION ENGINE"
        progressPct={progressPct}
      />
      <TreemationSubtitle captions={DEMO_CAPTIONS} top={1315} />
    </AbsoluteFill>
  );
};
