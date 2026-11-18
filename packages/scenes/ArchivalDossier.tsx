import React from "react";
import { AbsoluteFill } from "remotion";
import {
  ArchiveCredit,
  CamMove,
  CaptionStamp,
  CinemaCam,
  Dust,
  FilmLook,
  LightShafts,
  PhotoPlate,
  SourceBadge,
} from "@cosmos-motion/core";

export const ArchivalDossier: React.FC<{
  title: string;
  subtitle?: string;
  photoSrc: string;
  archiveLabel: string;
  citation: string;
  durationInFrames?: number;
  move?: CamMove;
  grade?: string;
}> = ({
  title,
  subtitle,
  photoSrc,
  archiveLabel,
  citation,
  durationInFrames = 120,
  move = "dollyIn",
  grade = "sepia",
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e14", overflow: "hidden" }}>
      <CaptionStamp title={title} subtitle={subtitle} />
      <SourceBadge category="ARSIP SEJARAH" source={citation} />

      <CinemaCam durationInFrames={durationInFrames} move={move}>
        <PhotoPlate
          src={photoSrc}
          durationInFrames={durationInFrames}
          grade={grade}
          opacity={0.42}
          blur={1.2}
        />
        <PhotoPlate
          src={photoSrc}
          durationInFrames={durationInFrames}
          grade={grade}
          x={140}
          y={340}
          w={800}
          h={860}
          radius={14}
          frame
        />
        <ArchiveCredit text={archiveLabel} top={1216} />
        <LightShafts x={540} y={180} angle={16} color="255, 214, 140" intensity={0.2} count={3} />
        <Dust count={24} />
      </CinemaCam>
      <FilmLook warmth={0.2} vignette={0.56} />
    </AbsoluteFill>
  );
};
